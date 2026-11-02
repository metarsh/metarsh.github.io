import { CodeBlock } from "@/components/CodeBlock";
import { EmiliaArchitectureDiagram } from "./EmiliaArchitectureDiagram";

export const EmiliaArticle = () => (
  <>
    <p className="text-xl sm:text-2xl text-white font-medium leading-snug tracking-tight">
      Traffic scaling and failure modes
    </p>

    <p>
      I built Emilia in 2021 as a modular Telegram bot for group administration, federated bans,
      anime lookups, and moderation filters. When it was running in a handful of small groups, a
      basic Pyrogram script on standard asyncio with direct MongoDB queries worked fine.
    </p>

    <p>
      Once public supergroups with 20,000 to 50,000 members added the bot, traffic changed
      completely. Within months, Emilia was in 5,000 groups with over 900,000 users. During peak
      hours, incoming message rates pushed past 10,000 updates a minute. The original architecture
      collapsed under that volume: MongoDB CPU hit 100%, connection pools dried up, query latency
      jumped from 8ms to over 2 seconds, and Telegram throttled the bot token with FloodWait errors
      for failing to acknowledge updates in time.
    </p>

    <p>
      Active groups do not generate sequential traffic. During busy hours, dozens of members chat at
      once, bots spam links, and new accounts join in waves. Every message produces an MTProto
      update that the bot receives immediately.
    </p>

    <p>
      Originally, my message handler updated telemetry synchronously: on every incoming message, it
      updated the user's username, recorded their current chat, and touched their last-active
      timestamp. With 50 groups receiving 10 messages a second, that produced 500 individual MongoDB
      update queries per second.
    </p>

    <p>
      The MongoDB connection pool was capped at{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        maxPoolSize=100
      </code>
      . Under burst traffic, all 100 sockets were occupied waiting on disk writes. Query latency
      jumped from 8ms to 2,400ms. Because asyncio worker coroutines were blocked awaiting database
      responses, incoming network packets piled up in the TCP buffer until Telegram flagged the bot
      as unresponsive.
    </p>

    {/* Architecture Diagram */}
    <EmiliaArchitectureDiagram />

    <p className="text-lg sm:text-xl text-white font-medium pt-6 leading-snug">
      Replacing the default asyncio event loop with uvloop
    </p>

    <p>
      Before changing database queries, I replaced CPython's default asyncio event loop. Standard
      asyncio is written in Python and incurs measurable dispatch overhead when juggling thousands
      of rapid network frames. Under heavy load, coroutine switching alone was taking up roughly a
      third of the container CPU.
    </p>

    <p>
      I installed{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        uvloop
      </code>{" "}
      at the process entry point before initializing any database drivers or clients. Because uvloop
      is written in C around libuv, coroutine scheduling overhead dropped significantly, doubling
      packet ingestion capacity. However, a faster loop just delivered packets to a congested
      database faster.
    </p>

    <p className="text-lg sm:text-xl text-white font-medium pt-6 leading-snug">
      Batching user writes with an in-memory buffer
    </p>

    <p>
      The primary cause of database saturation was telemetry. Every incoming message needed to
      record the user's username, their current chat, and their last active timestamp. Writing this
      directly to MongoDB on every packet is wasteful when the same active users send multiple
      messages within a few seconds.
    </p>

    <p>
      To solve this, I wrote an in-memory buffer in{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        Emilia/utils/write_buffer.py
      </code>
      . When a message arrives, the handler adds the user's details to an in-memory dictionary
      protected by an{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        asyncio.Lock
      </code>
      . If a user posts multiple times across different chats within a five-second window, all
      changes merge into a single dictionary entry in RAM.
    </p>

    <p>
      Every five seconds, a background task acquires the lock, swaps the active dictionary with an
      empty one, and releases the lock immediately. The swap takes microseconds, so incoming message
      handlers never block waiting on disk I/O. The task then compiles the detached dictionary into
      a list of UpdateOne operations and sends them in a single bulk_write call with{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        ordered=False
      </code>
      .
    </p>

    <p>
      Using{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        ordered=False
      </code>{" "}
      lets MongoDB execute the batch operations concurrently across storage threads rather than
      executing them sequentially. Combined with{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        $setOnInsert
      </code>{" "}
      for initial records and{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        $addToSet
      </code>{" "}
      for chat associations, this reduced write queries from several thousand per minute to 12 bulk
      operations, cutting write IOPS by roughly 95%.
    </p>

    <CodeBlock
      filename="Emilia/utils/write_buffer.py (In-Memory Flusher)"
      language="python"
      code={`import asyncio, datetime
from pymongo import UpdateOne
from Emilia import LOGGER, db

class WriteBuffer:
    def __init__(self, flush_interval=5):
        self.flush_interval = flush_interval
        self.users_buffer = {}
        self.chats_buffer = {}
        self.lock = asyncio.Lock()
        self.running = False

    async def add_user(self, user_id, username=None, chat_id=None, chat_title=None, bot_id=None):
        async with self.lock:
            if user_id not in self.users_buffer:
                self.users_buffer[user_id] = {
                    "username": username,
                    "chats": {},
                    "bot_ids": set(),
                }
            entry = self.users_buffer[user_id]
            if username:
                entry["username"] = username
            if chat_id is not None:
                entry["chats"][chat_id] = {"chat_id": chat_id, "chat_title": chat_title}
            if bot_id:
                entry["bot_ids"].add(bot_id)

    async def _flush(self):
        async with self.lock:
            if not self.users_buffer and not self.chats_buffer:
                return
            # Atomic swap in memory: zero handler wait time
            users_to_write = self.users_buffer
            chats_to_write = self.chats_buffer
            self.users_buffer = {}
            self.chats_buffer = {}

        if users_to_write:
            requests = []
            now = datetime.datetime.now(datetime.timezone.utc)
            for user_id, data in users_to_write.items():
                update_doc = {"$setOnInsert": {"first_found_date": now}}
                if data["username"]:
                    update_doc["$set"] = {"username": data["username"]}
                if data["chats"]:
                    update_doc["$addToSet"] = {"chats": {"$each": list(data["chats"].values())}}
                if data["bot_ids"]:
                    update_doc.setdefault("$addToSet", {})["bot_ids"] = {"$each": list(data["bot_ids"])}

                requests.append(UpdateOne({"user_id": user_id}, update_doc, upsert=True))

            if requests:
                try:
                    await db.users.bulk_write(requests, ordered=False)
                    LOGGER.info(f"Flushed {len(requests)} aggregated users to MongoDB.")
                except Exception as e:
                    LOGGER.error(f"WriteBuffer flush error: {e}")`}
    />

    <p className="text-lg sm:text-xl text-white font-medium pt-6 leading-snug">
      Limiting connection pool size and adding compound indexes
    </p>

    <p>
      Increasing{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        maxPoolSize
      </code>{" "}
      to 500 or 1,000 does not fix connection timeouts in MongoDB. WiredTiger uses a ticket-based
      concurrency system with 128 read and 128 write tickets. Opening hundreds of concurrent
      connections causes threads to queue for tickets, increasing lock contention and CPU context
      switching.
    </p>

    <p>
      I kept{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        maxPoolSize
      </code>{" "}
      capped at 100 and set{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        minPoolSize=20
      </code>{" "}
      so connections were pre-warmed for traffic spikes. I also set{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        waitQueueTimeoutMS=2500
      </code>
      . If the pool saturates, queries fail quickly instead of queueing indefinitely and exhausting
      process memory.
    </p>

    <p>
      I also audited queries for unindexed collection scans (COLLSCAN). At 900,000 users, an
      unindexed lookup reads gigabytes of data into RAM. I added compound B-tree indexes for the
      most common query patterns:{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        ("chat_id", 1), ("user_id", 1)
      </code>{" "}
      for chat member lookups and{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        ("chat_id", 1), ("disabled_commands", 1)
      </code>{" "}
      for command filters. When combined with projections that request only needed fields, MongoDB
      satisfies queries directly from the B-tree index in RAM (
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        IXSCAN
      </code>
      ) without fetching full documents from disk.
    </p>

    <CodeBlock
      filename="Emilia/database/mongo.py (Driver Pool & Compound Indexing)"
      language="python"
      code={`import motor.motor_asyncio
from pymongo import IndexModel, ASCENDING
from Emilia import LOGGER, MONGO_URI, DB_NAME

# Driver Connection Pool Tuning for High-Concurrency Async Workers
client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_URI,
    minPoolSize=20,                # Pre-warmed sockets eliminate handshake spikes during traffic surges
    maxPoolSize=100,               # Strict concurrency barrier preventing WiredTiger ticket exhaustion
    maxIdleTimeMS=45000,           # Recycle idle sockets before cloud firewalls drop them
    waitQueueTimeoutMS=2500,       # Fail-fast timeout when pool is saturated to prevent coroutine pileup
    serverSelectionTimeoutMS=5000, # Rapid failover detection for replica set primary elections
    retryWrites=True,              # Transparent retry on transient network hiccups
)

db = client[DB_NAME]

async def init_indexes():
    """Build compound indexes with covering projections to eliminate COLLSCAN penalties."""
    LOGGER.info("Verifying compound indexes across core collections...")

    # Compound index for chat member lookups: ensures IXSCAN covering queries
    user_chat_index = IndexModel(
        [("chat_id", ASCENDING), ("user_id", ASCENDING)],
        name="chat_member_lookup_idx",
        background=True,
    )

    # Compound index for fast permission & command status checks
    chat_command_index = IndexModel(
        [("chat_id", ASCENDING), ("disabled_commands", ASCENDING)],
        name="command_filter_idx",
        background=True,
    )

    await db.chat_members.create_indexes([user_chat_index])
    await db.chat_settings.create_indexes([chat_command_index])
    LOGGER.info("Compound indexes built successfully.")`}
    />

    <p className="text-lg sm:text-xl text-white font-medium pt-6 leading-snug">
      Two-tier caching with Redis Pub/Sub invalidation
    </p>

    <p>
      Reducing write traffic addressed half the bottleneck. The other half was read traffic. For
      every message, the bot checks chat settings: admin status, disabled commands, antiflood
      limits, and keyword filters.
    </p>

    <p>
      Querying MongoDB on every message is too slow. Putting Redis in front helped, but querying
      Redis over loopback TCP still takes 0.3ms to 1.5ms per command due to socket I/O,
      serialization, and event loop scheduling. When a bot evaluates five to ten settings across
      hundreds of messages per second, those small fractions add up.
    </p>

    <p>
      I implemented a two-tier cache in{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        Emilia/utils/cache.py
      </code>
      :
    </p>

    <ul className="list-disc list-inside space-y-2 text-zinc-300">
      <li>
        L1: An in-process{" "}
        <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
          OrderedDict
        </code>{" "}
        LRU capped at 10,000 items. Lookups take less than 0.05 microseconds with zero network calls
        and no serialization.
      </li>
      <li>
        L2: Redis, serialized with{" "}
        <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
          orjson
        </code>
        . When L1 misses, the bot reads from Redis, stores the result in L1, and returns it.
      </li>
    </ul>

    <p>
      When scaling across multiple worker processes, local L1 caches can desynchronize. If an admin
      runs{" "}
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        /anidisable
      </code>{" "}
      on Worker 1, Worker 1 updates Redis and evicts its local L1 entry, but Worker 2 still holds
      the old setting in its local RAM.
    </p>

    <p>
      To keep workers in sync without distributed locks, I set up a Redis Pub/Sub invalidation
      channel (
      <code className="text-zinc-200 font-mono text-sm bg-white/[0.05] px-1.5 py-0.5 rounded">
        cache_inv:settings
      </code>
      ). Each worker process generates a random instance ID at startup. When any worker updates or
      deletes a key, it writes to Redis and publishes a message with its instance ID and the
      modified key. Other workers listening on the channel check the instance ID, and if it does not
      match their own, they evict the key from their local L1 cache.
    </p>

    <CodeBlock
      filename="Emilia/utils/cache.py (L1 LRU + Redis Pub/Sub Invalidation)"
      language="python"
      code={`import asyncio, time, uuid, orjson
from collections import OrderedDict
import redis.asyncio as redis

class MultiLevelCache:
    def __init__(self, redis_url, namespace="cache", max_l1_entries=10_000, default_ttl=300):
        self._l1_cache = OrderedDict()
        self._max_l1 = max_l1_entries
        self._default_ttl = default_ttl
        self._redis_url = redis_url
        self._namespace = namespace
        self._instance_id = uuid.uuid4().hex
        self._channel_name = f"cache_inv:{namespace}"
        self._redis = None
        self._pubsub_redis = None

    async def start(self):
        self._redis = redis.from_url(self._redis_url)
        self._pubsub_redis = redis.from_url(self._redis_url, socket_timeout=None)
        self._listener_task = asyncio.create_task(self._listen_for_invalidation())

    async def get(self, key: str):
        # 1. Check L1 In-Memory LRU (<0.05ms)
        entry = self._l1_cache.get(key)
        if entry is not None:
            if time.time() <= entry["expires"]:
                self._l1_cache.move_to_end(key)
                return entry["value"]
            del self._l1_cache[key]

        # 2. Check L2 Redis
        if self._redis:
            raw = await self._redis.get(f"{self._namespace}:{key}")
            if raw:
                val = orjson.loads(raw)
                self._l1_cache[key] = {"value": val, "expires": time.time() + self._default_ttl}
                return val
        return None

    async def set(self, key: str, value, ttl=None):
        ttl = ttl or self._default_ttl
        self._l1_cache[key] = {"value": value, "expires": time.time() + ttl}
        if self._redis:
            # Write to Redis and broadcast cross-shard cache invalidation
            await self._redis.set(f"{self._namespace}:{key}", orjson.dumps(value), ex=ttl)
            await self._redis.publish(self._channel_name, orjson.dumps({"i": self._instance_id, "k": key}))

    async def _listen_for_invalidation(self):
        pubsub = self._pubsub_redis.pubsub()
        await pubsub.subscribe(self._channel_name)
        async for msg in pubsub.listen():
            if msg and msg["type"] == "message":
                data = orjson.loads(msg["data"])
                # If another worker changed this key, evict from local L1 memory
                if data["i"] != self._instance_id:
                    self._l1_cache.pop(data["k"], None)`}
    />

    <p className="text-lg sm:text-xl text-white font-medium pt-6 leading-snug">Key takeaways</p>

    <ul className="list-disc list-inside space-y-2 text-zinc-300">
      <li>
        Buffer telemetry writes in RAM: An in-memory dictionary with a 5-second atomic swap cut
        MongoDB write queries by 95%.
      </li>
      <li>
        Limit connection pools: Keeping maxPoolSize at 100 and indexing compound query keys
        prevented thread contention and WiredTiger ticket starvation.
      </li>
      <li>
        Invalidate local caches over Pub/Sub: An in-process OrderedDict LRU eliminated network
        round-trips for permissions, while Redis Pub/Sub kept multiple worker processes in sync.
      </li>
    </ul>

    <p>
      The full source code for Emilia, including the WriteBuffer and MultiLevelCache
      implementations, is on GitHub.
    </p>
  </>
);
