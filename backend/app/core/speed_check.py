import speedtest
def test_internet_speed():
    try:
        st = speedtest.Speedtest()
        print("Testing internet speed...")
        download_speed = st.download() / 1000000
        upload_speed = st.upload() / 1000000
        ping = st.results.ping

        result = {
            "download": round(download_speed, 2),
            "upload": round(upload_speed, 2),
            "ping": round(ping, 2)
        }
        print("Speed test result:", result)
        return result

    except Exception as e:
        print("An error occurred during the speed test:", str(e))
        return {
            "download": None,
            "upload": None,
            "ping": None
        }

