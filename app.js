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


/* DNS */

const dnsResult =
    document.getElementById("dnsResult");

const dnsTitle =
    document.getElementById("dnsTitle");

const dnsMessage =
    document.getElementById("dnsMessage");

const resolvedIp =
    document.getElementById("resolvedIp");


/* IP Intelligence */

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


/* HTTP */

const httpPanel =
    document.getElementById("httpPanel");

const httpMessage =
    document.getElementById("httpMessage");

const httpLatency =
    document.getElementById("httpLatency");


/* Network */

const nodes =
    document.querySelectorAll(".network-node");

const packets =
    document.querySelectorAll(".packet");


/*
 * Pause execution for a specified
 * amount of time.
 */
function sleep(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });

}


/*
 * Perform a real DNS-over-HTTPS lookup.
 *
 * Google's public DNS resolver returns
 * JSON containing DNS records.
 */
async function resolveDomain(domain) {

    const url =
        `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`;

    const response =
        await fetch(url);


    if (!response.ok) {
        throw new Error("DNS request failed");
    }


    const data =
        await response.json();


    /*
     * DNS status 0 means NOERROR.
     *
     * We also require an Answer section.
     */
    if (
        data.Status !== 0 ||
        !data.Answer
    ) {
        throw new Error("Domain not found");
    }


    /*
     * DNS type 1 = IPv4 A record.
     */
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


/*
 * Query ipapi for real information
 * about the resolved IP address.
 *
 * ipapi provides city, region, country,
 * latitude, longitude, timezone, ASN,
 * organization and other IP metadata.
 */
async function getIpIntelligence(ip) {

    const url =
        `https://ipapi.co/${encodeURIComponent(ip)}/json/`;


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
            data.reason || "IP lookup failed"
        );
    }


    return data;
}


/*
 * Measure how long an HTTP request to
 * the destination takes.
 *
 * This is NOT an ICMP ping.
 *
 * It measures the browser's HTTP request
 * timing where the destination allows the
 * request.
 */
async function measureHttpLatency(domain) {

    const url =
        `https://${domain}/`;


    const start =
        performance.now();


    try {

        /*
         * no-cors allows the browser to send
         * the request even when the destination
         * does not expose CORS headers.
         *
         * The response itself is opaque, but
         * request timing can still be measured.
         */
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


/*
 * Display successful DNS resolution.
 */
function showDnsSuccess(
    domain,
    ip
) {

    dnsResult.classList.remove(
        "hidden"
    );

    dnsResult.classList.remove(
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


/*
 * Display DNS failure.
 */
function showDnsError(
    domain
) {

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


/*
 * Display IP intelligence.
 */
function showIpIntelligence(data) {

    intelligencePanel.classList.remove(
        "hidden"
    );


    intelIp.textContent =
        data.ip || "—";


    intelOrg.textContent =
        data.org || "Unknown";


    intelAsn.textContent =
        data.asn || "Unknown";


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
}


/*
 * Display an IP intelligence failure.
 *
 * DNS can succeed even when the secondary
 * intelligence service is unavailable.
 */
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
}


/*
 * Reset the visualization.
 */
function resetNetwork() {

    nodes.forEach(node => {

        node.classList.remove(
            "active",
            "complete"
        );

    });


    packets.forEach(packet => {

        packet.classList.remove(
            "moving"
        );

    });


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


    dnsResult.classList.add(
        "hidden"
    );


    intelligencePanel.classList.add(
        "hidden"
    );


    httpPanel.classList.add(
        "hidden"
    );
}


/*
 * Display HTTP measurement.
 */
function showHttpResult(
    result
) {

    httpPanel.classList.remove(
        "hidden"
    );


    if (result === null) {

        httpLatency.textContent =
            "—";


        httpMessage.textContent =
            "The destination could not be measured from the browser.";

        return;
    }


    httpLatency.textContent =
        result;


    httpMessage.textContent =
        "Measured browser HTTP request time to the destination.";


    latency.textContent =
        `${result} ms`;
}


/*
 * Run the simulated packet route.
 *
 * The route itself is still simulated.
 *
 * Version 3 will replace this with
 * actual traceroute information.
 */
async function animatePacketRoute() {

    connectionStatus.textContent =
        "TRACING";


    packetStatus.textContent =
        "INITIALIZING";


    await sleep(500);


    /*
     * These are intentionally not presented
     * as real network measurements.
     */
    const simulatedHopTimes = [
        2,
        5,
        9,
        14,
        21
    ];


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
                "FORWARDED";


            packetId.textContent =
                "#" +
                Math.floor(
                    Math.random() * 90000 +
                    10000
                );


            ttl.textContent =
                64 - i;


            await sleep(1000);


            packet.classList.remove(
                "moving"
            );
        }


        node.classList.add(
            "complete"
        );


        await sleep(300);
    }


    packetCount.textContent =
        "32 / 32";


    hopCount.textContent =
        nodes.length - 1;


    packetStatus.textContent =
        "DELIVERED";


    connectionStatus.textContent =
        "CONNECTION ESTABLISHED";
}


/*
 * Main trace workflow.
 */
async function tracePacket() {

    const destination =
        destinationInput.value
            .trim()
            .replace(/^https?:\/\//i, "")
            .replace(/\/.*$/, "");


    if (!destination) {

        destinationInput.focus();

        return;
    }


    /*
     * Prevent duplicate traces while
     * the current trace is running.
     */
    traceButton.disabled =
        true;


    resetNetwork();


    targetName.textContent =
        destination;


    detailDestination.textContent =
        destination;


    targetIp.textContent =
        "Resolving...";


    connectionStatus.textContent =
        "RESOLVING";


    packetStatus.textContent =
        "DNS LOOKUP";


    /*
     * STEP 1
     *
     * Real DNS resolution.
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


        connectionStatus.textContent =
            "RESOLVED";


    } catch (error) {

        showDnsError(
            destination
        );


        connectionStatus.textContent =
            "DNS FAILED";


        packetStatus.textContent =
            "DOMAIN NOT FOUND";


        traceButton.disabled =
            false;


        return;
    }


    /*
     * STEP 2
     *
     * Real IP intelligence.
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
     * STEP 3
     *
     * Measure browser HTTP request.
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
     * STEP 4
     *
     * Run the current simulated
     * network visualization.
     */
    await animatePacketRoute();


    traceButton.disabled =
        false;
}


/*
 * Trace button.
 */
traceButton.addEventListener(
    "click",
    tracePacket
);


/*
 * Press Enter to trace.
 */
destinationInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            tracePacket();

        }

    }
);