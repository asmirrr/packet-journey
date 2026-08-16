# ◈ Packet Journey

> A visual exploration of what happens when your computer connects to an internet destination.

Packet Journey is a small browser-based networking visualization tool.

Enter a domain such as `google.com`, `github.com`, or `cloudflare.com` and Packet Journey performs real DNS resolution, retrieves IP/network intelligence, estimates the destination's geographic location, measures browser HTTP response time, and visualizes the conceptual journey of a packet across the internet.

---

## Current Version

**v2.2.0**

Packet Journey is currently a frontend networking experiment using live external data.

---

## Features

### Real Data

Packet Journey currently performs several real network lookups:

- DNS A-record resolution
- IPv4 destination discovery
- IP geolocation
- ASN information
- Organization / ISP information
- Country and region
- City
- Timezone
- Geographic coordinates
- Browser HTTP response measurement

### Visualization

The application also provides a visual representation of:

- Local device
- Router / gateway
- ISP
- DNS resolver
- Internet
- Destination server
- Packet movement
- TTL changes
- Packet identifiers
- Route progression

### Geographic Destination

v2.2 adds a geographic destination visualization based on the approximate coordinates returned by the IP intelligence service.

The geographic visualization is intentionally stylized rather than pretending to be a precise map.

---

## How It Works

A simplified version of what happens when you enter a domain:

```text
             DNS
              │
              ▼
       domain → IP address
              │
              ▼
       IP intelligence
              │
              ├── organization
              ├── ASN
              ├── location
              └── coordinates
              │
              ▼
        HTTP request
              │
              ▼
       response timing
              │
              ▼
       visualized journey
```

## Author

Muhammad Asmir Khan