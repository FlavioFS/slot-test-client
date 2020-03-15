export abstract class NetworkLog {
    
    /**
     * Writes a reel-rolling result to history in local storage.
     * @param result The result to write.
     */
    public static appendResult (result: IResult) {
        var xhr = new XMLHttpRequest();
        var url = "https://slot-test-server2.firebaseapp.com/result";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "*/*");
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState === 4 && xhr.status === 200) {

        //     }
        // };
        xhr.send(JSON.stringify(result));
    }

}
