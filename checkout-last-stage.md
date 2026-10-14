system design real time msg app
1-1 messsaing
sending recieving syn anbd dlivery state
retrieving retrying

allocate 5 min instrution
validate your assumptions
cover the requirement
functional and non functional design

scale user geographic observatility

make sure to ask question

throwv high level system design
why are doing that
trade offs

I can deliver


white board.

Adding any extras, just to narrow the scope, because you have an hour to cover all of that:
- Sending and receiving
- Sync and delivery state
- Retrieving potentially lost messages or messaging in the queue if there is a connectivity issue, something like that
- When we drop connection or something, retrying the sending message
Does that also include that? My advice is, actually, okay. You know that pretty much this is going to be around that. My advice is we're going to give you some instructions: I will say allocate 5 minutes to go through the instruction, and then after that, you want to cover the requirement gathering.
First of all, validate your assumption. If there is anything unclear from the instruction, make sure that you validate those assumptions and cover the requirement gathering well for the functional and non-functional aspects of your system design. You can ask, walk through, and validate your assumption, as you said, but you also may want to ask additional questions, let's say around the scale, the user geography, uptime requirements, observability, and whatever you want to ask. Make sure that you ask questions.
One question: what will be the end goal of this exercise? What is the expectation? Instead of designing the system, do I need to present it only as how I would build it, or can I draw my high-level system design during the interview, as much as I can cover, and go through all the architectural steps? Why am I doing that, what are the trade-offs, and how am I going to build my system design at a very high level?
The idea is that you can deliver an end-to-end, functioning system. Obviously, it's all very high level. If the drawing is not perfect, it's okay. It's more about being able to walk through any sort of architectural challenges, the trade-offs, and why you're taking certain decisions.
If I understand correctly, correct me if I'm wrong, this will be more like a chat: showing my approach to that problem, how I would design the system, writing the notes, and then presenting these notes. I don't need to live code it at that time.
As you speak, you're basically doing it live with interviewers. The way you should probably think is just to pretend that you have a meeting with your one or two colleagues. You're talking about a real-time messaging web application that you need to build, and you're going to start high-level designing your end-to-end solution: what you should think, why, what the trade-offs are, and everything.
That's cool, that's all understandable. Thank you. It's a high-level estimate and planning, and how I would build the app. That's all good.


edge cases or error scenarios
ui and ux and accessibilty

scalability
paginating time reponses
time based
pagination
metrics specific of the system
message delivery latency web sockets
undelivered message rate

real time communication server polling

how it integrates the backend - bonus points
data integrity and ordering
correct paginatons and messaging especiallty when new message contstantly arriving
token based vs page number base approaches

pagingation and synchronisation


Error

Client side data management: retrieve data state as source of truth
How to achieve
local storage vs estdb
zustand

Security measurements: OAuth, firewalls, HTTPS, rate limiting

Connection management, optimistic UI updates, local db and memory cache and claming data sync

Rendering 100000 without. crashing, tab/view

Memmory efficiency, bandwidth

UX, pending messgaes, indicators

Tradeoff - why you choose websockets over polling

server first rendering

Where your design could break during network

Track as support off token, HTTP/S

--------------


Candidate, don't ask about deeper qualification on edge cases or error scenarios, or question around UI and UX that I would not consider. I think you were probably quite good on that during the take-home, so I'm not concerned. Make sure that you clarify and ask questions around functional and non-functional, probably scalability, which is something that they mentioned during the take-home. I'll focus on that, but I will keep in mind UX, UI, and accessibility because that's also important, and that should be reflected there as well.
For scalability, you could also consider paginating API responses and choose time-based pagination, for example. Obviously, when you touch on observability, think about metrics that are specific to a messaging system that you could probably mention and use to track the health of the system:
- message delivery latency
- WebSocket connection drops
- queue depth
- undelivered message rate
That's also important.
The way I would probably structure it is:
1. You cover the requirement guide, as you said.
2. You ask functional questions.
3. You want to talk about real-time communication and justify your choice for using technologies like WebSockets, server-sent events, or polling.
4. You could also mention how this integrates with the backend. That could give you some extra points.
5. Be mindful that there is a time constraint, so you can touch on that and give some kind of input on that. That's good.
6. You want to touch on data integrity and ordering: how to ensure the correct ordering and pagination of messages, especially when new messages are constantly arriving. That means also using token-based versus page-number-based approaches, for example, at pagination and synchronisation.
7. As we said earlier, talk about error and edge case handling. Your messaging app should be resilient, so how are you going to deal with network connectivity issues, recovery, and reconnection?
8. Follow up with observability as well: how we can track the error rates and how the app performs.
9. Client-side data management: treat the local state as a source of truth. How to achieve features like offline reading by storing the messages in the browser. You can probably talk about the option of local storage versus in the DP. One is synchronous, the other one is asynchronous. There's some memory limitation with local storage, so touch on that as well. Why should we pick one or another?
10. Allow firewalls, HTTPS. That's actually a good one.
11. What should be the must-have thing that you must focus on? As we said, evaluate and narrow the scope to one-to-one messaging, core primitives. I think we touched on that.
12. Architectural data flow in terms of connection management, WebSocket lifecycle, optimistic UI updates, local database versus memory cache, and client data sync.
13. Scalability and performance: message list virtualization, rendering 10,000 messages without crushing the tab/view, payload size, exponential backoff, and dropped connections. That's the retry method as well. We should consider retrying if the data connection drops.
14. You can probably mention memory efficiency, network battery/bandwidth, and cost. That's something extra to mention.
15. I think user experience handling offline, flaky network states, pending fail messages, UI indicators, and unread counters is something that we discussed before, and I'm definitely not worried about it.
16. Trade-off and self-evaluation: we'll probably try to evaluate why you choose WebSockets or long polling.
17. Local-first versus server-first rendering: we would probably try to see in what way your design could break down under a bad network condition. Think about that.
18. Again, the ability to walk them through trade-offs and the why, I think, is very, very important, especially if you write a view from mid-level. That would probably be less expected for a senior. Essentially, that's the main kind of difference between the levels.
19. Security and observability: threat as supporting auth, and HTTPS, as we said, I think we touched on that.
20. What they will definitely try to assess is your trade-off and the why. Sometimes they will challenge you, so it's good to see when people are obviously able to articulate why they're taking certain decisions. It is also probably good, on the flip side, to understand when candidates are receptive to feedback, because they're there to challenge you, but they could also be there to help you. When someone is too defensive on something, it is also not necessarily a good signal, so try to find the balance.
21. It's also more like they want to test and see how I'm thinking and how I'm basically cooperating with them. Absolutely.
22. I feel like less is better than more. Don't say things just for the sake of saying them if you don't know or if you don't have enough technical debt, because then it will come up, and they don't like to see people throwing buzzwords. If you're not confident about talking about something, probably just avoid it. If it comes up, okay, lucky, but let's say: just talk about what you are sure of, what you can obviously give enough knowledge on or showcase enough knowledge on. Sometimes we see candidates, more commonly at mid-level or more junior level, who just throw buzzwords, and then they are not able to elaborate. The knowledge is just academic; it's not firsthand, and it's more like they read from the book.
23. I get it. I think it also looks quite bad when you throw just buzzwords and then you can't vouch for them and you cannot explain what you mean.
Thank you, Ludo. That's all helpful.



--------------

With the situational answers, the idea is that they will assess you on some of our most important operating principles. You can showcase a good example of:
- what the situation was
- what kind of action you took
- what the impact was
- what your impact was
- what the outcome of that was
A lot of people are very good at presenting the situation and presenting what action they took, but a lot of people forget to mention the result: what was the outcome of that?
Especially as a senior, you should have enough first-time experiences, and also you should have enough content to speak to and go into details. We're not going to evaluate you from a technical point of view because you may be talking to a senior engineering manager who is more like a backend profile rather than frontend. It is more about alignment with that specific principal type.

--------

bd owner

How to indentify gaps and draw improvements: showcase proactive action, identify problems, would like to see impact of that

Customer first: prioritisation and customer focus, could you walk us through when system goes down,
Be the owner. They could ask you things like: Could you give me an example of a time where you went beyond your assigned duties, where you were able to identify gaps and drive improvements? The idea is that you can showcase proactive action, identify the ability to identify problems even outside of your scope or your core task, and then they probably would like to see the impact of that. What was the outcome of that?

Another one is what we call "customer first": your level of prioritisation and customer focus. That could be about: Could you walk us through a specific situation? That could be a situation of an emergency: the system goes down, whatever. What were the trade-offs? How did you manage the incident, and how did you make a decision under pressure where there was a customer impact as a key factor?

--------

Clear process of prioritisation: how you will be handling? Impact of end user.

------

Ability to expendise solution and what would be the outcome of that.

! Level of ownership !


-----
afflit mindset: quality and problem solving

Do you have example of technical startegci output and applied deadline. Articulating trade offs and proposing creating solutions. Explain the !impact! (thats very importat) of that.


-------
grow mindset and feedback

Was showcasing a clear process of prioritisation: how you've been handling the incidents over a specific project, for example. It's very important that you showcase that you have a very strong understanding of the customer input.

The customer for us is our main client. For you, depending on what company you're working for, that could be external customers or internal stakeholders. It could vary, but it is very important to highlight that you have a good understanding of the impact that could have on your end user, let's say.

I think you've been very good in the UI/UX part as well, so I would assume that you have a very strong customer focus in mind. Obviously, the ability to also expedite a solution is very important. What was the outcome of that? For us, if our system goes down, that could have a huge impact on thousands of merchants at a very large scale. We need to be able to prioritise different emergency situations and minimise the customer impact of that.

This example is also going to showcase some level of ownership as well. Ownership is something that will always come up together with customer centricity anyway. Another important one that is certainly going to come up is what we call athlete mindset, meaning that there could be about quality versus deadline and problem solving. They could ask you, "Do you have an example of any sort of difficult technical or strategic trade-off under a tight deadline?" That is about articulating a trade-off, providing technical rationale, and proposing creative solutions. That could also be about explaining the input of that. As I said, a lot of people forget about the input. That's very important. I'll mark it.

Last but not least is Better Every Day: your growth mindset and feedback. We could ask you, "Do you have specific feedback you received over time? How did it change your approach? How have you been applying the lesson learned?" A lot of people try to go to impress during an interview, and a lot of people are reluctant to talk about something that they may have done wrong in the past. We all make mistakes at some point in our career. We all receive feedback, good or bad, so normally it's not seen as a bad signal.

It's about something that refers to a mistake that you've done, the feedback you receive, and how you apply the lesson learned from that. That could be something good, because if, as a senior, you're not able to articulate any sort of constructive feedback you receive about something that you've done, that's not necessarily correct.

Obviously, because we are all human beings, we make mistakes, and I think it's important to grow from this. Also, think about how you take feedback on board. How proactive are you on feedback? We like to see people that are actually chasing feedback or proactive on feedback, rather than people that are waiting for feedback.

Also, how do you deliver feedback to peers? How do you handle it, because obviously, as a senior, you'd be working with more junior developers? That's good.


Discuss with you today. Cool, I got all the notes. It's really helpful, actually. It's quite a lot, but I know that it looks like a lot. Obviously, some of the things are also things that I do on a daily basis as well, so it's not going to be something unusual. It's really, really helpful. Thank you, Ludow, because I have things to work on as well.

Anyway, don't worry. I think we won't be able to schedule the interview for this week anyway, so it will have to be for next week, if that helps as well. That will be nice. I have more time to prepare.

No, when I clicked on the link, the available slots were only for this week. That's okay. I do the same. Yes, I see it. I see it. Because I had it open, I just refreshed, and now I see more time slots.

I'll probably pick dates for next week because I also want to move it faster. I don't want to wait that much, but I still want to prepare something. I'll pick some dates now after the call, and I will let you know. You said Tuesday, Wednesday, and Friday. I'll pick those days then.

Cool, thank you so much, Ludo. Thank you. That was very helpful. Have a good day. Bye-bye.

star framework