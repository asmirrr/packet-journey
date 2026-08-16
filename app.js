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


/* ==================== IP INTELLIGENCE ==================== */

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


/* ==================== HELPERS ==================== */

function sleep(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });

}


/*
 * Normalize whatever the user enters.
 *
 * Examples:
 *
 * google.com
 * https://google.com
 * https://google.com/
 *
 * all become:
 *
 * google.com
 */
function normalizeDestination(value) {

    return value
        .trim()
        .replace(/^https?:\/\//i, "")
        .replace(/\/.*$/, "");
}


/* ==================== DNS ==================== */

async function resolveDomain(domain) {

    const url =
        `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`;

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


    quickStatus.textContent =
        "RESOLVING";


    quickStatus.className =
        "quick-status";


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

    const city =
        data.city || "Unknown";


    const country =
        data.country_code ||
        data.country_name ||
        "Unknown";


    quickLocation.textContent =
        `${city}, ${country}`;


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


/* ==================== INTELLIGENCE UI ==================== */

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


    updateQuickIntelligence(
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


/* ==================== HTTP UI ==================== */

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


/* ==================== ROUTE ANIMATION ==================== */

async function animatePacketRoute() {

    connectionStatus.textContent =
        "TRACING";


    packetStatus.textContent =
        "INITIALIZING";


    await sleep(400);


    /*
     * The route remains conceptual in v2.1.
     *
     * These values are NOT claimed to be
     * real network hop measurements.
     */
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
        "DELIVERED";


    connectionStatus.textContent =
        "CONNECTION ESTABLISHED";


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
     * ============================
     * STEP 1 — REAL DNS
     * ============================
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
            "RESOLVED";


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
     * ============================
     * STEP 2 — IP INTELLIGENCE
     * ============================
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
     * ============================
     * STEP 3 — HTTP
     * ============================
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
     * ============================
     * STEP 4 — VISUALIZATION
     * ============================
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

        if (event.key === "Enter") {

            tracePacket();

        }

    }
);