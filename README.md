# Packet Journey

An interactive network visualization that demonstrates the conceptual journey of a packet from a local device to a remote destination.

## Live Demo

Coming soon.

## Overview

Packet Journey visualizes the path a network packet can take when communicating with a remote server.

The current visualization follows the conceptual route:

Your Device → Router → ISP → DNS → Internet → Target

Version 1.5 introduces real DNS resolution using DNS-over-HTTPS.

## Features

- Real DNS resolution
- Real IPv4 address detection
- Domain validation
- DNS failure handling
- Animated packet transmission
- Network hop visualization
- Packet inspector
- TTL visualization
- Packet IDs
- Destination input
- Responsive interface
- Terminal-inspired UI

## Technologies

- HTML
- CSS
- JavaScript
- Fetch API
- DNS-over-HTTPS

## How DNS Resolution Works

When a user enters a domain such as:

    google.com

Packet Journey sends a DNS query to Google's public DNS-over-HTTPS resolver.

The resolver returns DNS information, including an IPv4 address when available.

For example:

    google.com
        ↓
    DNS lookup
        ↓
    IPv4 address
        ↓
    Packet Journey visualization

If the domain cannot be resolved, the visualization stops and displays the DNS failure.

## Networking Concepts

This project demonstrates concepts including:

- DNS
- IP addressing
- Network hops
- Routers
- Packet forwarding
- TTL (Time To Live)
- TCP/IP
- Network latency

## Important Technical Note

DNS resolution is real.

The network route and latency values displayed in the current visualization are simulated and are not measurements of the actual network path to the destination.

Future versions will replace simulated measurements with real network data where technically possible.

## Roadmap

### Version 1.0

- [x] Interactive network visualization
- [x] Animated packet
- [x] Packet inspector
- [x] Responsive interface

### Version 1.5

- [x] Real DNS resolution
- [x] Real IPv4 address detection
- [x] Invalid domain handling
- [x] DNS status display

## Author

Muhammad Asmir Khan