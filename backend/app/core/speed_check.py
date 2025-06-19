import speedtest

def test_internet_speed():
    try:
        st = speedtest.Speedtest()
        print("Testing internet speed...")
        download_speed = st.download() / 2000000
        upload_speed = st.upload() / 2000000
        ping = st.results.ping

        result = {
            "download": round(download_speed, 2),
            "upload": round(upload_speed, 2),
            "ping": round(ping, 2)
        }
        print("Speed test result:", result)
        return result

    except speedtest.SpeedtestException as e:
        print("An error occurred during the speed test:", str(e))
        return {
            "download": None,
            "upload": None,
            "ping": None
        }

if __name__ == "__main__":
    test_internet_speed()

# This script tests the internet speed using the speedtest-cli library.
#SRC: https://medium.com/@shokomelu/checking-internet-speed-with-a-python-script-1c5485e1a48e