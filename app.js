/* ============================================================
   PACKET JOURNEY
   Version 2.3.1
   ============================================================ */


/* ==================== CONFIG ==================== */

const VERSION = "2.3.1";

const DNS_ENDPOINT =
    "https://dns.google/resolve";

const IP_API_BASE =
    "https://ipapi.co/";

const MAP_DEFAULT_ZOOM = 2;


/* ==================== ELEMENTS ==================== */

const traceButton =
    document.getElementById("traceButton");

const destinationInput =
    document.getElementById("destination");

const targetName =
    document.getElementById("targetName");

const targetIp =
    document.getElementById("targetIp");

const detailDestination =
    document.getElementById("detailDestination");

const connectionStatus =
    document.getElementById("connectionStatus");

const packetStatus =
    document.getElementById("packetStatus");

const packetCount =
    document.getElementById("packetCount");

const hopCount =
    document.getElementById("hopCount");

const latency =
    document.getElementById("latency");

const ttl =
    document.getElementById("ttl");

const packetId =
    document.getElementById("packetId");

const traceTimestamp =
    document.getElementById("traceTimestamp");


/* ==================== QUICK RESULT ==================== */

const quickResult =
    document.getElementById("quickResult");

const quickDestination =
    document.getElementById("quickDestination");

const quickStatus =
    document.getElementById("quickStatus");

const quickIp =
    document.getElementById("quickIp");

const quickLocation =
    document.getElementById("quickLocation");

const quickOrg =
    document.getElementById("quickOrg");

const quickLatency =
    document.getElementById("quickLatency");


/* ==================== DNS ==================== */

const dnsResult =
    document.getElementById("dnsResult");

const dnsTitle =
    document.getElementById("dnsTitle");

const dnsMessage =
    document.getElementById("dnsMessage");

const resolvedIp =
    document.getElementById("resolvedIp");


/* ==================== INTELLIGENCE ==================== */

const intelligencePanel =
    document.getElementById("intelligencePanel");

const intelIp =
    document.getElementById("intelIp");

const intelOrg =
    document.getElementById("intelOrg");

const intelAsn =
    document.getElementById("intelAsn");

const intelCountry =
    document.getElementById("intelCountry");

const intelCity =
    document.getElementById("intelCity");

const intelRegion =
    document.getElementById("intelRegion");

const intelTimezone =
    document.getElementById("intelTimezone");

const intelCoordinates =
    document.getElementById("intelCoordinates");


/* ==================== MAP ==================== */

const locationPanel =
    document.getElementById("locationPanel");

const packetMapElement =
    document.getElementById("packetMap");

const mapLocation =
    document.getElementById("mapLocation");

const mapLatitude =
    document.getElementById("mapLatitude");

const mapLongitude =
    document.getElementById("mapLongitude");

const mapTimezone =
    document.getElementById("mapTimezone");

const userLocationStatus =
    document.getElementById("userLocationStatus");


/* ==================== HTTP ==================== */

const httpPanel =
    document.getElementById("httpPanel");

const httpMessage =
    document.getElementById("httpMessage");

const httpLatency =
    document.getElementById("httpLatency");


/* ==================== NETWORK ==================== */

const nodes =
    document.querySelectorAll(".network-node");

const packets =
    document.querySelectorAll(".packet");


/* ==================== MAP STATE ==================== */

let map = null;

let destinationMarker = null;

let userMarker = null;

let routeLine = null;

let userCoordinates = null;

let destinationCoordinates = null;


/* ==================== HELPERS ==================== */

function sleep(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}


function normalizeDestination(value) {

    let destination =
        value.trim();

    destination =
        destination
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .split("/")[0]
            .split("?")[0]
            .split("#")[0]
            .trim();

    return destination;

}


function formatLocation(data) {

    const city =
        data.city || "Unknown";

    const country =
        data.country_code ||
        data.country_name ||
        "Unknown";

    return `${city}, ${country}`;

}


/* ==================== DNS ==================== */

async function resolveDomain(domain) {

    const url =
        `${DNS_ENDPOINT}?name=${encodeURIComponent(domain)}&type=A`;

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            "DNS request failed"
        );

    }

    const data =
        await response.json();

    if (
        data.Status !== 0 ||
        !data.Answer
    ) {

        throw new Error(
            "Domain not found"
        );

    }

    const ipv4Record =
        data.Answer.find(
            record => record.type === 1
        );

    if (!ipv4Record) {

        throw new Error(
            "No IPv4 address found"
        );

    }

    return ipv4Record.data;

}


/* ==================== IP INTELLIGENCE ==================== */

async function getIpIntelligence(ip) {

    const url =
        `${IP_API_BASE}${encodeURIComponent(ip)}/json/`;

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            "IP intelligence request failed"
        );

    }

    const data =
        await response.json();

    if (data.error) {

        throw new Error(
            data.reason ||
            "IP lookup failed"
        );

    }

    return data;

}


/* ==================== HTTP ==================== */

async function measureHttpLatency(domain) {

    const url =
        `https://${domain}/`;

    const start =
        performance.now();

    try {

        await fetch(
            url,
            {
                method: "GET",
                mode: "no-cors",
                cache: "no-store"
            }
        );

        const end =
            performance.now();

        return Math.round(
            end - start
        );

    } catch (error) {

        return null;

    }

}


/* ==================== QUICK RESULT ==================== */

function showQuickResult(domain) {

    quickResult.classList.remove(
        "hidden"
    );

    quickDestination.textContent =
        domain;

    setQuickStatus(
        "RESOLVING"
    );

    quickIp.textContent =
        "Resolving...";

    quickLocation.textContent =
        "Resolving...";

    quickOrg.textContent =
        "Resolving...";

    quickLatency.textContent =
        "Measuring...";

}


function updateQuickIp(ip) {

    quickIp.textContent =
        ip;

}


function updateQuickIntelligence(data) {

    quickLocation.textContent =
        formatLocation(data);

    quickOrg.textContent =
        data.org ||
        "Unknown";

}


function updateQuickLatency(value) {

    if (value === null) {

        quickLatency.textContent =
            "Unavailable";

        return;

    }

    quickLatency.textContent =
        `${value} ms`;

}


function setQuickStatus(
    text,
    type = ""
) {

    quickStatus.textContent =
        text;

    quickStatus.className =
        `quick-status ${type}`;

}


/* ==================== DNS UI ==================== */

function showDnsSuccess(
    domain,
    ip
) {

    dnsResult.classList.remove(
        "hidden",
        "error"
    );

    dnsTitle.textContent =
        "Domain resolved";

    dnsMessage.textContent =
        `${domain} successfully resolved through DNS.`;

    resolvedIp.textContent =
        ip;

    targetIp.textContent =
        ip;

}


function showDnsError(domain) {

    dnsResult.classList.remove(
        "hidden"
    );

    dnsResult.classList.add(
        "error"
    );

    dnsTitle.textContent =
        "Domain not found";

    dnsMessage.textContent =
        `No DNS record could be found for ${domain}.`;

    resolvedIp.textContent =
        "NXDOMAIN";

    targetIp.textContent =
        "Unresolved";

}


/* ==================== INTELLIGENCE UI ==================== */

function showIpIntelligence(data) {

    intelligencePanel.classList.remove(
        "hidden"
    );

    intelIp.textContent =
        data.ip ||
        "—";

    intelOrg.textContent =
        data.org ||
        "Unknown";

    intelAsn.textContent =
        data.asn ||
        "Unknown";

    intelCountry.textContent =
        data.country_name ||
        data.country_code ||
        "Unknown";

    intelCity.textContent =
        data.city ||
        "Unknown";

    intelRegion.textContent =
        data.region ||
        "Unknown";

    intelTimezone.textContent =
        data.timezone ||
        "Unknown";


    if (
        data.latitude !== undefined &&
        data.longitude !== undefined
    ) {

        intelCoordinates.textContent =
            `${data.latitude}, ${data.longitude}`;

    } else {

        intelCoordinates.textContent =
            "Unavailable";

    }


    updateQuickIntelligence(
        data
    );


    showLocation(
        data
    );

}


function showIpIntelligenceError() {

    intelligencePanel.classList.remove(
        "hidden"
    );

    intelIp.textContent =
        "Unavailable";

    intelOrg.textContent =
        "Unavailable";

    intelAsn.textContent =
        "Unavailable";

    intelCountry.textContent =
        "Unavailable";

    intelCity.textContent =
        "Unavailable";

    intelRegion.textContent =
        "Unavailable";

    intelTimezone.textContent =
        "Unavailable";

    intelCoordinates.textContent =
        "Unavailable";

    quickLocation.textContent =
        "Unavailable";

    quickOrg.textContent =
        "Unavailable";

}


/* ==================== MAP INITIALIZATION ==================== */

function initializeMap() {

    if (map) {

        return;

    }


    map =
        L.map(
            packetMapElement,
            {
                zoomControl: true,
                worldCopyJump: true
            }
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);


    map.setView(
        [20, 0],
        MAP_DEFAULT_ZOOM
    );

}


/* ==================== MAP MARKERS ==================== */

function createDestinationIcon() {

    return L.divIcon(
        {
            className:
                "destination-map-icon",

            html:
                `<div style="
                    width:14px;
                    height:14px;
                    border-radius:50%;
                    background:#ffffff;
                    border:2px solid #08090c;
                    box-shadow:0 0 0 5px rgba(255,255,255,0.15), 0 0 18px rgba(255,255,255,0.8);
                "></div>`,

            iconSize: [14, 14],

            iconAnchor: [7, 7]
        }
    );

}


function createUserIcon() {

    return L.divIcon(
        {
            className:
                "user-map-icon",

            html:
                `<div style="
                    width:13px;
                    height:13px;
                    border-radius:50%;
                    background:#65ff9a;
                    border:2px solid #08090c;
                    box-shadow:0 0 0 5px rgba(101,255,154,0.15), 0 0 18px rgba(101,255,154,0.8);
                "></div>`,

            iconSize: [13, 13],

            iconAnchor: [6.5, 6.5]
        }
    );

}


/* ==================== USER LOCATION ==================== */

function requestUserLocation() {

    if (
        !navigator.geolocation
    ) {

        userLocationStatus.textContent =
            "Geolocation unavailable";

        return;

    }


    userLocationStatus.textContent =
        "Requesting permission...";


    navigator.geolocation.getCurrentPosition(

        position => {

            userCoordinates = [
                position.coords.latitude,
                position.coords.longitude
            ];


            userLocationStatus.textContent =
                "Location detected";


            if (!map) {

                initializeMap();

            }


            if (userMarker) {

                userMarker.remove();

            }


            userMarker =
                L.marker(
                    userCoordinates,
                    {
                        icon:
                            createUserIcon()
                    }
                )
                .addTo(map)
                .bindPopup(
                    "<strong>Your approximate location</strong>"
                );


            updateMapView();

        },


        error => {

            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                userLocationStatus.textContent =
                    "Permission denied";

            } else if (
                error.code ===
                error.POSITION_UNAVAILABLE
            ) {

                userLocationStatus.textContent =
                    "Location unavailable";

            } else if (
                error.code ===
                error.TIMEOUT
            ) {

                userLocationStatus.textContent =
                    "Location timed out";

            } else {

                userLocationStatus.textContent =
                    "Location unavailable";

            }

        },

        {
            enableHighAccuracy: false,

            timeout: 8000,

            maximumAge: 300000
        }

    );

}


/* ==================== DESTINATION MAP ==================== */

function showLocation(data) {

    if (
        data.latitude === undefined ||
        data.longitude === undefined
    ) {

        return;

    }


    const latitude =
        Number(data.latitude);

    const longitude =
        Number(data.longitude);


    if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
    ) {

        return;

    }


    destinationCoordinates = [
        latitude,
        longitude
    ];


    locationPanel.classList.remove(
        "hidden"
    );


    mapLocation.textContent =
        formatLocation(data);


    mapLatitude.textContent =
        latitude.toFixed(4);

    mapLongitude.textContent =
        longitude.toFixed(4);

    mapTimezone.textContent =
        data.timezone ||
        "Unknown";


    initializeMap();


    if (destinationMarker) {

        destinationMarker.remove();

    }


    destinationMarker =
        L.marker(
            destinationCoordinates,
            {
                icon:
                    createDestinationIcon()
            }
        )
        .addTo(map)
        .bindPopup(
            `<strong>${escapeHtml(
                formatLocation(data)
            )}</strong><br>${escapeHtml(
                data.ip || ""
            )}`
        );


    updateMapView();

}


/* ==================== MAP VIEW ==================== */

function updateMapView() {

    if (!map) {

        return;

    }


    if (
        userCoordinates &&
        destinationCoordinates
    ) {

        if (routeLine) {

            routeLine.remove();

        }


        routeLine =
            L.polyline(
                [
                    userCoordinates,
                    destinationCoordinates
                ],
                {
                    color: "#65ff9a",

                    weight: 2,

                    opacity: 0.7,

                    dashArray: "7 8"
                }
            ).addTo(map);


        const bounds =
            L.latLngBounds(
                [
                    userCoordinates,
                    destinationCoordinates
                ]
            );


        map.fitBounds(
            bounds,
            {
                padding: [70, 70],

                maxZoom: 7
            }
        );


        return;

    }


    if (destinationCoordinates) {

        map.setView(
            destinationCoordinates,
            5
        );

    }

}


/* ==================== HTML SAFETY ==================== */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ==================== HTTP UI ==================== */

function showHttpResult(result) {

    httpPanel.classList.remove(
        "hidden"
    );


    if (result === null) {

        httpLatency.textContent =
            "—";

        httpMessage.textContent =
            "The destination could not be measured from the browser.";

        updateQuickLatency(
            null
        );

        return;

    }


    httpLatency.textContent =
        result;

    httpMessage.textContent =
        "Measured browser HTTP request time to the destination.";

    latency.textContent =
        `${result} ms`;

    updateQuickLatency(
        result
    );

}


/* ==================== RESET ==================== */

function resetNetwork() {

    nodes.forEach(
        node => {

            node.classList.remove(
                "active",
                "complete"
            );

        }
    );


    packets.forEach(
        packet => {

            packet.classList.remove(
                "moving"
            );

        }
    );


    packetCount.textContent =
        "0 / 32";

    hopCount.textContent =
        "0";

    latency.textContent =
        "— ms";

    ttl.textContent =
        "64";

    packetId.textContent =
        "—";

    packetStatus.textContent =
        "WAITING";

    traceTimestamp.textContent =
        "—";


    dnsResult.classList.add(
        "hidden"
    );

    intelligencePanel.classList.add(
        "hidden"
    );

    locationPanel.classList.add(
        "hidden"
    );

    httpPanel.classList.add(
        "hidden"
    );


    if (routeLine) {

        routeLine.remove();

        routeLine = null;

    }


    if (destinationMarker) {

        destinationMarker.remove();

        destinationMarker = null;

    }


    destinationCoordinates = null;

}


/* ==================== ROUTE ANIMATION ==================== */

async function animatePacketRoute() {

    connectionStatus.textContent =
        "TRACING";

    packetStatus.textContent =
        "VISUALIZING ROUTE";


    await sleep(400);


    for (
        let i = 0;
        i < nodes.length;
        i++
    ) {

        const node =
            nodes[i];


        node.classList.add(
            "active"
        );


        hopCount.textContent =
            i;


        if (i > 0) {

            const packet =
                packets[i - 1];


            packet.classList.add(
                "moving"
            );


            packetStatus.textContent =
                "PACKET MOVING";


            packetId.textContent =
                "#" +
                Math.floor(
                    Math.random() *
                    90000 +
                    10000
                );


            ttl.textContent =
                64 - i;


            await sleep(900);


            packet.classList.remove(
                "moving"
            );

        }


        node.classList.add(
            "complete"
        );


        await sleep(250);

    }


    packetCount.textContent =
        "32 / 32";

    hopCount.textContent =
        nodes.length - 1;

    packetStatus.textContent =
        "VISUALIZATION COMPLETE";

    connectionStatus.textContent =
        "TRACE COMPLETE";


    setQuickStatus(
        "COMPLETE",
        "success"
    );

}


/* ==================== MAIN TRACE ==================== */

async function tracePacket() {

    const destination =
        normalizeDestination(
            destinationInput.value
        );


    if (!destination) {

        destinationInput.focus();

        return;

    }


    traceButton.disabled =
        true;


    resetNetwork();


    const timestamp =
        new Date();


    traceTimestamp.textContent =
        timestamp.toLocaleTimeString();


    targetName.textContent =
        destination;

    detailDestination.textContent =
        destination;

    targetIp.textContent =
        "Resolving...";


    showQuickResult(
        destination
    );


    connectionStatus.textContent =
        "RESOLVING";

    packetStatus.textContent =
        "DNS LOOKUP";


    /*
     * ============================================
     * STEP 1 — REAL DNS
     * ============================================
     */

    let ip;


    try {

        ip =
            await resolveDomain(
                destination
            );


        showDnsSuccess(
            destination,
            ip
        );


        updateQuickIp(
            ip
        );


        connectionStatus.textContent =
            "DNS RESOLVED";

    } catch (error) {

        showDnsError(
            destination
        );


        setQuickStatus(
            "DNS FAILED",
            "error"
        );


        quickIp.textContent =
            "Unresolved";

        quickLocation.textContent =
            "—";

        quickOrg.textContent =
            "—";

        quickLatency.textContent =
            "—";


        connectionStatus.textContent =
            "DNS FAILED";

        packetStatus.textContent =
            "DOMAIN NOT FOUND";


        traceButton.disabled =
            false;


        return;

    }


    /*
     * ============================================
     * STEP 2 — IP INTELLIGENCE
     * ============================================
     */

    packetStatus.textContent =
        "IP INTELLIGENCE";


    try {

        const data =
            await getIpIntelligence(
                ip
            );


        showIpIntelligence(
            data
        );

    } catch (error) {

        showIpIntelligenceError();

    }


    /*
     * ============================================
     * STEP 3 — USER LOCATION
     * ============================================
     */

    requestUserLocation();


    /*
     * ============================================
     * STEP 4 — HTTP
     * ============================================
     */

    packetStatus.textContent =
        "MEASURING HTTP";


    httpPanel.classList.remove(
        "hidden"
    );


    httpMessage.textContent =
        "Measuring response time...";


    httpLatency.textContent =
        "—";


    const httpTime =
        await measureHttpLatency(
            destination
        );


    showHttpResult(
        httpTime
    );


    /*
     * ============================================
     * STEP 5 — VISUALIZATION
     * ============================================
     */

    await animatePacketRoute();


    traceButton.disabled =
        false;

}


/* ==================== EVENTS ==================== */

traceButton.addEventListener(
    "click",
    tracePacket
);


destinationInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            tracePacket();

        }

    }
);


/* ==================== INITIALIZATION ==================== */

console.log(
    `Packet Journey v${VERSION} initialized.`
);