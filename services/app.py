from flask import Flask, jsonify
from scapy.all import sniff
from scapy.layers.dot11 import Dot11
import threading

app = Flask(__name__)

# Dictionary to hold the MAC addresses with dummy data for testing
mac_addresses = {
    "00:1A:2B:3C:4D:5E": {"device_type": "Smartphone", "signal_strength": -45},
    "11:22:33:44:55:66": {"device_type": "Laptop", "signal_strength": -60},
    "11:22:33:44:55:66": {"device_type": "Laptop", "signal_strength": -60},
}

# Create a lock object to handle thread safety for mac_addresses
lock = threading.Lock()

# Function to process packets and extract MAC addresses
def packet_handler(packet):
    if packet.haslayer(Dot11):
        mac_addr = packet.addr2

        if mac_addr:
            print(f"Packet captured: {packet.summary()}")  # Print packet summary for debugging
            # Acquire lock before modifying shared data
            with lock:
                if mac_addr not in mac_addresses:
                    # Dynamically add new MAC address to the dictionary
                    mac_addresses[mac_addr] = {"device_type": "Unknown", "signal_strength": -50}
                    print(f"New MAC address detected: {mac_addr}")

# Function to start sniffing in a separate thread
def start_sniffing():
    sniff(prn=packet_handler, iface="Wi-Fi 2", store=0)

# API endpoint to return the count of unique devices
@app.route('/device-count', methods=['GET'])
def get_device_count():
    with lock:  # Ensure safe access to the dictionary
        device_count = len(mac_addresses)
    return jsonify({'device_count': device_count})

# API endpoint to return the list of MAC addresses
@app.route('/mac-addresses', methods=['GET'])
def get_mac_addresses():
    with lock:  # Ensure safe access to the dictionary
        return jsonify({'mac_addresses': list(mac_addresses.keys())})

# Start the sniffing thread
sniff_thread = threading.Thread(target=start_sniffing)
sniff_thread.daemon = True
sniff_thread.start()

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
