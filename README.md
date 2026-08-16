# Packet Journey

An interactive network visualization that explores the journey of a network packet from a local device to a remote destination.

**Current Version: v2.0.0**

## Live Demo

Coming soon.

## Overview

Packet Journey combines real network information with an interactive visualization.

Enter a domain such as:

    google.com

Packet Journey performs:

    Domain
       ↓
    DNS Resolution
       ↓
    IPv4 Address
       ↓
    IP Intelligence
       ↓
    HTTP Measurement
       ↓
    Network Visualization

## Features

### Real Data

- Real DNS resolution
- Real IPv4 address detection
- IP geolocation
- City and region
- Country
- Coordinates
- ASN
- Organization
- Timezone
- Browser HTTP request timing

### Visualization

- Animated packet transmission
- Network hop visualization
- Packet inspector
- TTL visualization
- Packet IDs
- Destination information
- Live trace status
- Responsive interface
- Terminal-inspired UI

## Technologies

- HTML
- CSS
- JavaScript
- Fetch API
- DNS-over-HTTPS
- ipapi IP intelligence API
- Browser Performance API

## DNS Resolution

Packet Journey uses Google's public DNS-over-HTTPS resolver to resolve domains into IPv4 addresses.

For example:

    google.com
        ↓
    DNS lookup
        ↓
    142.xxx.xxx.xxx

If the domain cannot be resolved, the trace is stopped.

## IP Intelligence

After resolving the domain, Packet Journey queries the resolved IP address using ipapi.

The application can retrieve information including:

- IP address
- City
- Region
- Country
- Latitude
- Longitude
- Timezone
- ASN
- Organization

IP data is provided by ipapi:

https://ipapi.co/

## HTTP Measurement

Packet Journey measures the time required for the browser to make an HTTPS request to the destination.

This measurement represents browser HTTP request timing.

It is NOT an ICMP ping and should not be interpreted as a traditional network ping.

Some destinations may block browser requests or behave differently depending on their security configuration.

## Simulated Network Route

The visual route currently represents a conceptual network path:

    Your Device
         ↓
       Router
         ↓
        ISP
         ↓
      DNS Server
         ↓
      Internet
         ↓
       Target

The individual hop timings and route are currently simulated.

They are intentionally labeled as visualization data rather than real traceroute measurements.

## Version History

### v1.0.0

- Interactive network visualization
- Animated packet
- Packet inspector
- Responsive interface

### v1.5.0

- Real DNS resolution
- Real IPv4 address detection
- Invalid domain handling
- DNS status display

### v2.0.0

- Real IP intelligence
- Geographic destination information
- ASN information
- Organization information
- Timezone information
- Coordinate information
- Real browser HTTP timing
- Version number displayed in application
- Improved loading and error states
- Clear distinction between real and simulated data

### v3.0.0 — Planned

- Backend traceroute service
- Real network hop information
- Geographic route visualization
- Actual hop-by-hop latency
- IPv4 / IPv6 support

## Technical Limitations

Web browsers intentionally restrict low-level network access.

Because of this, a frontend-only application cannot perform a traditional ICMP traceroute directly from JavaScript.

Version 3 will introduce a backend service capable of performing traceroute operations and returning the results to the frontend.

## Author

Muhammad Asmir Khan