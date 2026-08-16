const traceButton = document.getElementById("traceButton");
const destinationInput = document.getElementById("destination");

const targetName = document.getElementById("targetName");
const detailDestination = document.getElementById("detailDestination");

const connectionStatus = document.getElementById("connectionStatus");
const packetStatus = document.getElementById("packetStatus");

const packetCount = document.getElementById("packetCount");
const hopCount = document.getElementById("hopCount");
const latency = document.getElementById("latency");

const ttl = document.getElementById("ttl");
const packetId = document.getElementById("packetId");

const nodes = document.querySelectorAll(".network-node");
const packets = document.querySelectorAll(".packet");


const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


function resetNetwork() {

    nodes.forEach(node => {
        node.classList.remove("active", "complete");
    });

    packets.forEach(packet => {
        packet.classList.remove("moving");
    });

    packetCount.textContent = "0 / 32";
    hopCount.textContent = "0";
    latency.textContent = "— ms";

    ttl.textContent = "64";
    packetId.textContent = "—";

    packetStatus.textContent = "WAITING";
    connectionStatus.textContent = "READY";
}


async function tracePacket() {

    const destination = destinationInput.value.trim();

    if (!destination) {
        destinationInput.focus();
        return;
    }


    resetNetwork();


    targetName.textContent = destination;
    detailDestination.textContent = destination;


    connectionStatus.textContent = "TRACING";
    packetStatus.textContent = "INITIALIZING";


    await sleep(500);


    const hopLatencies = [
        2,
        5,
        9,
        14,
        21
    ];


    for (let i = 0; i < nodes.length; i++) {

        const node = nodes[i];

        node.classList.add("active");

        hopCount.textContent = i;


        if (i > 0) {

            const packet = packets[i - 1];

            packet.classList.add("moving");

            packetStatus.textContent = "FORWARDED";

            packetId.textContent =
                "#" + Math.floor(Math.random() * 90000 + 10000);

            ttl.textContent = 64 - i;

            if (hopLatencies[i - 1]) {
                latency.textContent =
                    hopLatencies[i - 1] + " ms";
            }

            await sleep(1000);

            packet.classList.remove("moving");
        }


        node.classList.add("complete");

        await sleep(300);
    }


    packetCount.textContent = "32 / 32";
    hopCount.textContent = nodes.length - 1;

    latency.textContent =
        hopLatencies[hopLatencies.length - 1] + " ms";


    packetStatus.textContent = "DELIVERED";
    connectionStatus.textContent = "CONNECTION ESTABLISHED";
}


traceButton.addEventListener("click", tracePacket);


destinationInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        tracePacket();
    }

});