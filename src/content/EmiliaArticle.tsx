import type { ReactNode } from "react";
import { EmiliaArchitectureDiagram } from "./EmiliaArchitectureDiagram";

const Source = ({ path, children }: { path: string; children: ReactNode }) => (
  <a
    href={`https://github.com/metarsh/Emilia/blob/main/Emilia/${path}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-zinc-100 underline decoration-white/25 underline-offset-4 hover:decoration-white/70"
  >
    {children}
  </a>
);

const headingClass = "text-xl sm:text-2xl text-white font-medium pt-8 leading-snug tracking-tight";

export const EmiliaArticle = () => (
  <div className="space-y-6 [&_p_code]:rounded [&_p_code]:bg-white/[0.05] [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:font-mono [&_p_code]:text-sm [&_p_code]:text-zinc-200">
    <p>
      Telegram gives one group chat a limit of having upto 200,000 members. Well but who will manage
      them? That's why i made Emilia, a group management bot. Over time, i found several problems
      based on user's feedbacks and implemented them accordingly in Emilia, hence converting it to a
      multi purpose bot. You want spam management, admin utilities? Emilia got it. You got multiple
      groups and having trouble managing them all? Emilia got it. You want anime features? Emilia
      got it. You want music in your voice chats? Emilia got it. You want a personal bot of your own
      but have no technical expertise or servers? Clone feature is here, so yeah! Emilia got it.
      Everything i did, i did for the users without any profit. So i hope you are here to know more
      about emilia. Let's get into it!
    </p>

    <p>
      Let's come to technical part, i am assuming you are a developer and wants to find out the idea
      behind creating a scalable bot. I organize Emilia around feature modules, with shared services
      for command handling and storage. The repository includes group administration, anime
      integrations, music, chatbot with voice, music system and clone hosting.
    </p>

    <h2 className={headingClass}>A ban that follows the spammer</h2>

    <p>
      Suppose you run an anime community with a discussion group and a separate recommendations
      group. You ban a spammer in one, and they join the other. Every administrator has to recognize
      the same account and repeat the ban. I added federations so administrators can link their
      groups to a shared ban list. One federation ban asks Emilia to remove that account from all
      participating groups.
    </p>

    <p>
      Saving the ban is a database write; enforcing it takes a separate Telegram request for each
      group. The bot might have lost permission to ban people in one group, or Telegram might tell
      it to wait before making more requests. My{" "}
      <Source path="modules/federations.py">ban handler</Source> paces the calls and retries when
      Telegram asks it to wait. Failed removals are logged as it continues through the groups.
    </p>

    <h2 className={headingClass}>Finding the show in a screenshot</h2>

    <p>
      An anime screenshot often arrives without a title. A member can reply to that image with
      Emilia's scene lookup command. I use trace.moe to find a matching scene, and Emilia returns
      the show's title with an episode number and a short preview. Once they know the show, they can
      look it up through AniList, an anime catalog and watch-list service, and add it to their
      linked watch list through buttons on Emilia's messages.
    </p>

    <p>
      A button that updates a watch list changes somebody's external account. I keep the account
      identity and intended action attached to the{" "}
      <Source path="modules/anime/anilist.py">result's buttons</Source>. For a group-linked account,
      Emilia checks that the person recorded in the link is still the group's Telegram owner before
      using it.
    </p>

    <h2 className={headingClass}>Playing a song while messages keep arriving</h2>

    <p>
      Telegram groups can have a live audio call alongside their text chat. Someone requests a song,
      and Emilia finds the media and prepares it for a separate assistant account to play in the
      call. Meanwhile, messages keep arriving, including messages the bot needs to moderate.
    </p>

    <p>
      YouTube extraction includes blocking work. Running it directly in the event loop, which
      handles incoming messages, would hold up other requests. I send it to{" "}
      <Source path="modules/music/core/youtube.py">worker threads</Source> so the loop can keep
      handling messages. Download work has its own thread pool, with timeouts and file-size limits
      to bound how long a request waits and how much media it can download.
    </p>

    <p>
      The queue has a different problem. With songs A, B and C waiting, removing the second song
      means B. If playback takes A off the queue before the removal finishes, position two now
      points to C. I give each queue entry an ID and resolve the requested position to that ID. A{" "}
      <Source path="services/music_queue.py">Redis script</Source> removes the matching entry in one
      atomic operation. A change in position cannot redirect that removal to another song.
    </p>

    <h2 className={headingClass}>Hosting someone else's bot</h2>

    <p>
      The clone feature lets a member use Emilia's group administration through a bot with its own
      identity. They create that identity through BotFather, Telegram's bot-creation account, then
      send Emilia its token in private using <code>/clone</code>. I run the client for them, so they
      can add their bot to a group without installing Python or renting a server. Each clone has its
      own Telegram session and uses Emilia's shared application.
    </p>

    <p>
      Starting another client opens another connection. My{" "}
      <Source path="services/clone_runtime.py">clone manager</Source> limits concurrent starts and
      cleans up clients when startup fails. Registration checks the bot's identity and its recorded
      owner before starting it. Music and chatbot replies run on the main bot.
    </p>

    <p>
      If more than one Emilia process is running, they need to agree on which one hosts a clone. I
      use a <Source path="services/clones.py">database lease</Source>: a record naming the
      responsible process, with an expiry time. That process renews the lease while it hosts the
      client. If it loses the lease or cannot renew it, it attempts to stop the client. An expired
      lease lets another process claim responsibility without depending on the old process to
      release it.
    </p>

    <h2 className={headingClass}>Remembering a conversation, then forgetting it</h2>

    <p>
      A member can continue a conversation by replying to Emilia's message. The chatbot uses Groq
      for model responses and keeps recent messages in a bounded session. A separate background
      request extracts user facts and preferences into MongoDB, so a later session can start with
      saved context. It can also turn a response into a Telegram voice note through Cartesia, a
      speech-generation service.
    </p>

    <p>
      Now suppose the member sends <code>/reset</code> while a memory update is still running.
      Deleting the database record alone would let that task finish and save the old facts again. In
      the <Source path="modules/chatbot.py">reset handler</Source>, I clear the current session,
      then cancel and await its pending memory tasks before deleting the saved record. Memory
      updates also check that they still belong to the current session before writing.
    </p>

    <h2 className={headingClass}>The database work behind a busy chat</h2>

    <p>
      Incoming messages also update user and group tracking records. A busy conversation can update
      the same records repeatedly, so I merge those changes in a bounded{" "}
      <Source path="utils/write_buffer.py">write buffer</Source> and normally save batches every
      five seconds. Each entry has a revision number. After a write succeeds, I remove the entry
      only if its revision is still the one saved. A newer update stays queued.
    </p>

    <p>
      Failed database writes stay queued too. During shutdown, Emilia tries to drain the buffer and
      saves any remaining backlog to a recovery file for the next startup. This leaves a tradeoff:
      tracking updates held only in memory can be lost if the process is killed before it saves
      them.
    </p>

    <EmiliaArchitectureDiagram />

    <p>
      I built Emilia for people who wanted help running their groups. As it grows, I want each new
      feature to work alongside the commands they already depend on. That means paying attention to
      requests that overlap and services that fail, because those details decide whether the bot is
      useful in a busy conversation.
    </p>

    <p>
      Try a feature you'd want in your own bot, then follow its handler in Emilia's source. Use that
      workflow as a starting point for your own implementation. If there is something your community
      needs that Emilia could help with, I'd like to hear about it in the repository.
    </p>
  </div>
);
