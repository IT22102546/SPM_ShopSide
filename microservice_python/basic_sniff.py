from scapy.all import sniff

def packet_handler(packet):
    print(packet.summary())

sniff(prn=packet_handler, iface="Wi-Fi", store=0)


# from flask import Flask, jsonify
# from scapy.all import sniff
# from scapy.layers.dot11 import Dot11

# import threading

# app = Flask(__name__)

# # Dictionary to hold the MAC addresses
# mac_addresses = {}

# # Function to process packets and extract MAC addresses
# def packet_handler(packet):
#     if packet.haslayer(Dot11):
#         mac_addr = packet.addr2
#         print(f"Packet captured: {packet.summary()}")  # Print packet summary debugging
#         if mac_addr not in mac_addresses:
#             mac_addresses[mac_addr] = True
#             print(f"New MAC address detected: {mac_addr}")


# # Function to start sniffing in a separate thread
# def start_sniffing():
#     sniff(prn=packet_handler, iface="Wi-Fi", store=0)

# # API endpoint to return the count of unique devices
# @app.route('/device-count', methods=['GET'])
# def get_device_count():
#     return jsonify({'device_count': len(mac_addresses)})

# #return mac addreses
# @app.route('/mac-addresses', methods=['GET'])
# def get_mac_addresses():
#     return jsonify({'mac_addresses': list(mac_addresses.keys())})


# # Start the sniffing thread
# sniff_thread = threading.Thread(target=start_sniffing)
# sniff_thread.daemon = True
# sniff_thread.start()

# # Run the Flask app
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)

# from flask import Flask, jsonify
# from scapy.all import sniff
# from scapy.layers.dot11 import Dot11

# import threading

# app = Flask(__name__)

# # File to store the MAC addresses
# mac_file = "mac_addresses.txt"

# # Function to process packets and extract MAC addresses
# def packet_handler(packet):
#     if packet.haslayer(Dot11):
#         mac_addr = packet.addr2
#         if mac_addr:
#             print(f"Packet captured: {packet.summary()}")  # Print packet summary for debugging
            
#             # Check if the MAC address is already stored in the file
#             if not mac_address_exists(mac_addr):
#                 with open(mac_file, 'a') as f:
#                     f.write(mac_addr + "\n")
#                 print(f"New MAC address detected and saved: {mac_addr}")

# # Function to check if a MAC address is already in the file
# def mac_address_exists(mac_addr):
#     try:
#         with open(mac_file, 'r') as f:
#             mac_addresses = f.readlines()
#         mac_addresses = [addr.strip() for addr in mac_addresses]  # Clean newlines
#         return mac_addr in mac_addresses
#     except FileNotFoundError:
#         # If file doesn't exist, it means no addresses have been stored yet
#         return False

# # Function to start sniffing in a separate thread
# def start_sniffing():
#     sniff(prn=packet_handler, iface="Wi-Fi", store=0)

# # API endpoint to return the count of unique devices
# @app.route('/device-count', methods=['GET'])
# def get_device_count():
#     try:
#         with open(mac_file, 'r') as f:
#             mac_addresses = f.readlines()
#         return jsonify({'device_count': len(mac_addresses)})
#     except FileNotFoundError:
#         return jsonify({'device_count': 0})

# # API endpoint to return the MAC addresses stored in the file
# @app.route('/mac-addresses', methods=['GET'])
# def get_mac_addresses():
#     try:
#         with open(mac_file, 'r') as f:
#             mac_addresses = [addr.strip() for addr in f.readlines()]
#         return jsonify({'mac_addresses': mac_addresses})
#     except FileNotFoundError:
#         return jsonify({'mac_addresses': []})

# # Start the sniffing thread
# sniff_thread = threading.Thread(target=start_sniffing)
# sniff_thread.daemon = True
# sniff_thread.start()

# # Run the Flask app
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)
