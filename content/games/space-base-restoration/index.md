---
title: Space Base Restoration
date: "2017-01-05"
tags: 
  - double fine
  - mod
  - lua
  - spacebase df9
category: mod
description: Space Base Restoration is a mod project focused on updating and adding content to Double Fine's Spacebase DF-9.
image: spacebaseHub.png
comments: true
---

Space Base Restoration is a mod I contributed to for [Double Fine's Spacebase DF-9](http://www.spacebasedf9.com/). While the mod is no longer actively being worked on, I figured it would be a good idea to talk about and reflect on what was accomplished with the mod. The mod managed to inject a tiny bit of life into a forgotten and dropped game. As of January 2017 the mod has been downloaded over 2,000 times.<!-- excerpt -->

If you don't know Spacebase DF-9 was an early-access simulation game released in 2014. The game spawned from Double Fine's [Amnesia Fortnight](https://www.wikiwand.com/en/Amnesia_Fortnight_2014) which is an internal game jam at their company. It has clear inspirations from [Dwarf Fortress](http://www.bay12games.com/dwarves/) in its game play interactions mixed with the stylized art of a typical Double Fine game. When the game released, it had a road map full of features and plans for continued development. Sadly, due to poor early-access sales, the game was sloppily rushed into a 1.0 version and arguably "released". One great thing they did do with the release is both support mods and release the game play logic source code. This led a few of us who saw potential in the game to attempt to continue the original vision of the game.

![Jukebox screenshot](screen00.png)

My first contribution was just adding a jukebox item into the game. I used the limited guides Double Fine had given us to implement a working jukebox. My interest in creating new content led me to the [Double Fine forums](https://forums.doublefine.com/) where a few others where starting to work on improving the game. Eventually, we all started communicating and working together. We very quickly ran into the issue that the mod support wasn't good enough to make changes to major systems so we started modifying the Lua source code directly. That task was one of the hardest things I had done at the time because the code wasn't in great shape. The code wasn't well commented and full of mysterious and ill-labeled functions. At that time I learned the importance of [clean code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882). But I actually started enjoying learning the pathways and intricacies of the code. I was able to help the others with the game object interfaces. Code wise I also worked on a trader system that was never fully added. This included dissecting the random event system in the game to allow for new events to be added. I also recently Implemented a multi-save file system. Though this was after most of the work had come to a stop so it's not included in any release.

The other major contribution I made was running the website. I worked with an artist in our team and created [SpaceBaseHub.net](http://www.spacebasehub.net/). It's built on top of [Jekyll](http://jekyllrb.com/) just like this website is. I really enjoyed working with the artist to create a good looking site. The biggest thing I enjoyed adding was analytic tracking for our site which included download tracking. This was all possible thanks to [Piwik](https://piwik.org/), an open-source web analytics platform. Following the creation of our new website and first official release, we even managed to get some coverage from [Gamasutra](http://www.gamasutra.com/view/news/255601/Modders_pick_up_Spacebase_development_where_Double_Fine_left_off.php) and [Kotaku](http://kotaku.com/fans-keep-working-on-cancelled-strategy-game-1735075779).

While the project isn't currently active, there is some chatter every now and then amongst some of the original contributors. If you enjoyed Spacebase DF-9 and want to help feel free to [contact me](/contact) and I can get you involved. You can also check out the mod source code over on [GitLab](https://gitlab.com/derelictgames/spacebase-v2-updated-code).
