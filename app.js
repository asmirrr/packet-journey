const traceButton = document.getElementById("traceButton");
const destinationInput = document.getElementById("destination");

const targetName = document.getElementById("targetName");
const targetIp = document.getElementById("targetIp");
const detailDestination = document.getElementById("detailDestination");

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

const dnsResult =
    document.getElementById("dnsResult");

const dnsTitle =
    document.getElementById("dnsTitle");

const dnsMessage =
    document.getElementById("dnsMessage");

const resolvedIp =
    document.getElementById("resolvedIp");

const nodes =
    document.querySelectorAll(".network-node");

const packets =
    document.querySelectorAll(".packet");


/*
 * Utility function used to pause the animation.
 */
function sleep(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });

}


/*
 * Perform a real DNS-over-HTTPS lookup.
 *
 * Google's public DNS resolver returns a JSON response
 * containing DNS records for the requested domain.
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
     * We also require an Answer section because a domain
     * can technically exist without having an A record.
     */
    if (data.Status !== 0 || !data.Answer) {
        throw new Error("Domain not found");
    }


    /*
     * DNS record type 1 = IPv4 / A record.
     */
    const ipv4Record =
        data.Answer.find(
            record => record.type === 1
        );


    if (!ipv4Record) {
        throw new Error("No IPv4 address found");
    }


    return ipv4Record.data;
}


/*
 * Display successful DNS resolution.
 */
function showDnsSuccess(domain, ip) {

    dnsResult.classList.remove("hidden");

    dnsResult.classList.remove("error");


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
function showDnsError(domain) {

    dnsResult.classList.remove("hidden");

    dnsResult.classList.add("error");


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
 * Reset the entire visualization before
 * starting another trace.
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
}


/*
 * Main trace function.
 *
 * Step 1:
 * Validate user input.
 *
 * Step 2:
 * Perform REAL DNS resolution.
 *
 * Step 3:
 * If DNS fails, stop.
 *
 * Step 4:
 * If DNS succeeds, run the
 * simulated network visualization.
 */
async function tracePacket() {

    const destination =
        destinationInput.value.trim();


    if (!destination) {

        destinationInput.focus();

        return;
    }


    resetNetwork();


    targetName.textContent =
        destination;


    detailDestination.textContent =
        destination;


    targetIp.textContent =
        "Resolving...";


    dnsResult.classList.add("hidden");


    connectionStatus.textContent =
        "RESOLVING";


    packetStatus.textContent =
        "DNS LOOKUP";


    /*
     * REAL DNS LOOKUP
     */
    try {

        const ip =
            await resolveDomain(destination);


        showDnsSuccess(
            destination,
            ip
        );


        connectionStatus.textContent =
            "RESOLVED";


        await sleep(700);


    } catch (error) {

        showDnsError(
            destination
        );


        connectionStatus.textContent =
            "DNS FAILED";


        packetStatus.textContent =
            "DOMAIN NOT FOUND";


        /*
         * Most importantly:
         * DO NOT continue the animation.
         */
        return;
    }


    /*
     * DNS succeeded.
     *
     * The rest of the network route is
     * currently simulated.
     */
    connectionStatus.textContent =
        "TRACING";


    packetStatus.textContent =
        "INITIALIZING";


    await sleep(500);


    /*
     * Simulated latency values.
     *
     * These are NOT real ping measurements yet.
     */
    const hopLatencies = [
        2,
        5,
        9,
        14,
        21
    ];


    /*
     * Move through every network node.
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


        /*
         * Every node after the first
         * has a connection/packet animation.
         */
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
                    Math.random() * 90000 + 10000
                );


            ttl.textContent =
                64 - i;


            if (hopLatencies[i - 1]) {

                latency.textContent =
                    hopLatencies[i - 1] +
                    " ms";

            }


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


    /*
     * Trace completed.
     */
    packetCount.textContent =
        "32 / 32";


    hopCount.textContent =
        nodes.length - 1;


    latency.textContent =
        hopLatencies[
            hopLatencies.length - 1
        ] + " ms";


    packetStatus.textContent =
        "DELIVERED";


    connectionStatus.textContent =
        "CONNECTION ESTABLISHED";
}


/*
 * Trace button.
 */
traceButton.addEventListener(
    "click",
    tracePacket
);


/*
 * Pressing Enter in the input
 * also starts the trace.
 */
destinationInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            tracePacket();

        }

    }
);