import wmi

def get_device_specs():
    c = wmi.WMI()
    for board in c.Win32_BaseBoard():
        print(f"Device: {board.Manufacturer} {board.Product}")

if __name__ == "__main__":
    get_device_specs()


