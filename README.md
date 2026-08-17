# Packet Journey

**Packet Journey** is a lightweight network visualization tool that shows the journey a request takes across the internet.

Enter a domain or URL and Packet Journey attempts to resolve the destination, measure network latency, identify the server's approximate location, and visualize the journey.

> Built as a small networking-focused project to make otherwise invisible internet infrastructure easier to understand.

---

## Features

- 🌐 Enter a website or domain
- 🔎 DNS resolution
- 📡 Network latency measurement
- 📍 Approximate destination location
- 🖥️ Destination IP address
- 📊 Visual packet journey
- ⚡ Response-time classification
- 🧭 Interactive journey visualization
- 📖 Built-in explanation of how Packet Journey works
- 🔗 "See How It Works" link to the GitHub repository
- 🏷️ Version indicator displayed directly in the application

---

## How It Works

Packet Journey follows several steps when you enter a destination:

```text
Website / Domain
       ↓
DNS Resolution
       ↓
Destination IP
       ↓
Network Request
       ↓
Latency Measurement
       ↓
IP Geolocation
       ↓
Packet Journey Visualization
```

### 1. DNS Resolution

The domain name is resolved into an IP address.

For example:

```text
example.com
     ↓
93.184.216.34
```

### 2. Network Request

Packet Journey sends a request toward the destination and measures how long the request takes.

This gives an approximate indication of network latency.

### 3. IP Geolocation

The destination IP can be checked against an IP geolocation service to estimate information such as:

* City
* Region
* Country
* ISP / organization
* Latitude
* Longitude

The location is approximate and does **not** represent the physical location of a specific server with perfect accuracy.

### 4. Visualization

The collected information is displayed as a simplified representation of the journey.

The visualization is intended to make networking concepts easier to understand rather than provide a literal traceroute of every router a packet crosses.

---

## Version History

### v3.0.0

* Rebuilt the geographic destination view around an interactive Leaflet map
* Replaced the fragmented CSS-generated map treatment with real map tiles
* Added an approximate origin-to-destination geographic route
* Added animated packet movement across the geographic route
* Added interactive map zoom and pan
* Added clearer map status and route labeling
* Added explicit approximate-route language to distinguish visualization from traceroute data
* Updated OpenStreetMap tile integration and attribution

### v2.3.1

* Restored the v2.2 visual style for the Live Trace / packet route
* Preserved the real networking and geolocation functionality introduced in v2.3
* Preserved the improved information layout and explanation section
* Updated the visible application version to v2.3.1
* No changes to the underlying network measurement logic

### v2.3

* Added destination location information
* Improved network information display
* Added clearer journey visualization
* Added built-in "How Packet Journey Works" explanation
* Added GitHub "See How It Works" link
* Improved overall layout and information hierarchy
* Added visible Packet Journey version number
* Improved handling of unavailable network information

### v2.2

* Improved destination/network information
* Added more detailed result information
* Improved UI organization
* Added additional project documentation

### v2.1

* Redesigned the main interface
* Integrated basic destination information into the primary view
* Added a dedicated explanation section
* Improved responsive layout

### v2.0

* Added real network requests
* Added DNS resolution
* Added latency measurement
* Added destination IP information
* Added more realistic network behavior

### v1.5

* Added basic destination validation
* Improved network simulation
* Improved visual feedback

### v1.0

* Initial Packet Journey concept
* Basic packet journey visualization
* Interactive destination input
* Initial networking-inspired interface

---

## Roadmap

Packet Journey is intentionally being developed in small versions so that each update introduces a meaningful improvement.

### Completed

* [x] Initial packet journey visualization
* [x] Destination input
* [x] Network latency
* [x] DNS resolution
* [x] Destination IP information
* [x] Real network requests
* [x] IP geolocation
* [x] Improved information layout
* [x] Built-in explanation section
* [x] Version indicator
* [x] GitHub project link
* [x] Restored v2.2 Live Trace visual style in v2.3.1

### Future

* [ ] Actual traceroute / hop visualization
* [ ] More detailed route intelligence
* [ ] Historical latency measurements

* [x] Interactive world map
* [x] Visualize approximate destination location
* [ ] More detailed route information
* [ ] Traceroute-style visualization
* [ ] Multiple destination comparisons
* [ ] Historical latency measurements
* [ ] Network performance graphs
* [ ] Better mobile experience
* [ ] More detailed ISP / ASN information
* [ ] Optional dark/light interface customization

---

## Project Structure

```text
packet-journey/
│
├── index.html
├── style.css
├── app.js
└── README.md
```

### `index.html`

Contains the structure of the Packet Journey interface.

### `style.css`

Controls the visual design, layout, animations, colors, and responsive behavior.

### `app.js`

Contains the application's networking logic, API requests, calculations, and visualization behavior.

### `README.md`

Contains documentation, project information, version history, and the development roadmap.

---

## Technologies

Packet Journey currently uses:

* HTML
* CSS
* JavaScript
* Fetch API
* DNS / network requests
* IP geolocation APIs

The project intentionally avoids a large framework so the underlying networking concepts remain visible in the code.

---

## Limitations

Packet Journey is a **visualization and educational tool**, not a replacement for professional network diagnostic software.

A browser cannot directly expose every router that a packet passes through.

Therefore, the displayed journey is an approximation based on information available to the browser and external services.

Latency can also vary depending on:

* Internet connection
* Wi-Fi conditions
* Geographic distance
* Server load
* Routing
* ISP behavior
* API response time

IP geolocation is also approximate.

---

## Why I Built This

The internet feels almost instantaneous, but every request still has to travel through a physical network.

Packet Journey was built to make that process visible.

Instead of simply typing a website into a browser and receiving a page, the project attempts to answer:

> **Where did that request go, and how long did the journey take?**

---

## Live Demo

**Packet Journey:**

https://asmirrr.github.io/packet-journey/

---

## GitHub

**Source Code:**

https://github.com/asmirrr/packet-journey

---

## License

This project is currently available for personal and educational use.

See the repository for the current licensing information.

---

## Author

Built by **Muhammad Asmir Khan**.

Packet Journey is an independent networking visualization project created to explore web development, networking concepts, APIs, and data visualization.
