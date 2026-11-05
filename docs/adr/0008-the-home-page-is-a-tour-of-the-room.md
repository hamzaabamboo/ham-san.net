# The home page is a scroll tour of the room

Supersedes [0001](0001-room-is-an-entrance-not-the-home-page.md). The owner chose the room as the home page's world on 2026-11-05. The home page wraps its server-rendered chapters in `RoomHome` tour mode: native scroll moves the camera between authored poses in the room model, each chapter names its object with `data-tour-stop`, and "Enter the room" switches to the existing free-roam controls in place. `/room` stays as the full-screen entrance.

The constraints that led to 0001 still hold, so the home page must keep them. Every chapter is plain HTML rendered on the server and readable with no WebGL. The 13 MB model loads only on idle and never under Save-Data or a 2G connection, behind the static room preview. Reduced motion stops ambient movement and snaps the camera to the chapter.
