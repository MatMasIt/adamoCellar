<h1 align="center">adamoCellar</h1>
<p align="center">
<img src="./icon.png" width=50>
</p>


This program was written for a friend, and consists of a very minimal cellar management system.

Wine bottles can be added, edited, viewed searched and sorted easily.

This program is intended to run on a computer in a cellar and be used to manage a wine collection.

## The technical standpoint

A php server is spawned and a kiosk firefox window is directed to the main app, which is a bootstrap-based dynamic ajax-reliant app.

Every task is completed through api calls to the php backend, which interfaces with a sqllite database.

All scripts and styles are local, beacuse the app is intended to work offline.