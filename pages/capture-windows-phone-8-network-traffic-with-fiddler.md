--title Capture Windows Phone 8 Network Traffic with Fiddler
--date 07/17/2013 14:45:05

Hi! Long time no post. I've been busy with my internship at [Nokia Music](http://www.nokia.com/gb-en/apps/app/nokia-music/). I've got some time off now though so I've been working on one of my own projects: a Last.fm history viewer for Windows Phone 8. As part of this I'm developing an [open source C# API on GitHub](https://github.com/inflatablefriends/lastfm).

Something developers often need during app development is the ability to debug HTTP calls. If this sounds like you then look no further...

---

# Fiddler
[Fiddler](http://fiddler2.com/) is a super useful tool which lets you inspect network traffic, almost essential if you're developing any kind of internet-bound app. I'll let them explain [why it's so great](http://fiddler2.com/features).

So today's post is dedicated on how to set up your phone to work with Fiddler. The steps are written with a Windows Phone 8 device in mind, but the steps also work for the emulator and other phones probably too. Here we go!

## Step 0
[Install Fiddler](http://fiddler2.com/get-fiddler) (use the .Net 4 version), and have your computer and phone on the same network (i.e. connected to the same WiFi router).

## Step 1
Check out Fiddler options in the Tools menu. Open the connections tab, and make sure you have "allow remote computers to connect."

![Fiddler options](/blog/content/images/2015/05/fiddler-001.png)

## Step 2
Find out your computer's machine name - easiest way is to type "machine name" into Windows search and click the "Rename this computer" option. In the example screenshots mine is "Rikki-dv6". Go back to Fiddler and type
`prefs set fiddler.network.proxy.registrationhostname Rikki-dv6`
into the black field on the bottom left, with your machine name instead of mine. Then restart Fiddler.

## Step 3
Now we need to direct traffic from the phone to Fiddler. If you're using an emulator then this should already happen; for devices however:

First we need your computer's ip address - easiest way is to open `cmd` and type `ipconfig`. Now on your phone, go to Settings > WiFi and tap on your active WiFi connection (note: the device and your computer should be on the same local network). You need to enter your computer's ip address and Fiddler's port as proxy settings:

![Network settings in Settings > WiFi](/blog/content/images/2015/05/wifi-settings.png)

Now when you use the internet on your phone you should see the traffic in Fiddler.

---

That's it! Were you expecting more? If you were, well done, as there's a couple more steps we need to do to see HTTPS traffic. Enabling this can cause some apps to break (for example you won't be able to install store apps while this is on), so keep that in mind.

## Step 4
Back in the Fiddler options, check the HTTPS tab. You need to enable both "capture HTTPS CONNECTs" and "decrypt HTTPS traffic."

![Fiddler options #2](/blog/content/images/2015/05/fiddler-002.png)

Now click "Export root certificate to desktop."

## Step 5
We now need a way to get this root certificate onto the phone. The easiest way is to set up an Autoresponder in Fiddler. Autoresponders are just one reason why Fiddler is great, as they let you intercept requests and return whatever you like.

In this case we are going to intercept the url `fi.d/dler.cer`  and return the root certificate (you're probably thinking `fiddler` would be easier  but Windows Phone needs the url to be a .cer file inside a valid looking domain).

![Fiddler web debugger](/blog/content/images/2015/05/fiddler-003.png)

In the Autoresponder tab of Fiddler, click "Add rule." Into the top field enter `fi.d/dler.cer` and in the bottom field choose "Find a file..." and use the FiddlerRoot.cer we exported earlier. Hit Save then make sure the rule has a checkmark next to it, and that the "Unmatched requests pass through" option is also checked.

## Step 6
Now all that's left is to visit fi.d/dler.cer on your phone! You should see this:

![Success!](/blog/content/images/2015/05/success.png)

Tap and install.

*Now* you're done :)
