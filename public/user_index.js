document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getNotifications')
    .then(response => response.json())
    .then(data => loadNotificationPane(data['data']));
});

function timeSince(date) {

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const then = date.split(/[-T :]/);
    const now = new Date();
    const utc1 = Date.UTC(then[0], then[1]-1, then[2]);
    const utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const day_diff = Math.floor((utc2 - utc1) / _MS_PER_DAY);

    if (day_diff >= 365) {
        return Math.floor(day_diff / 365).toString() + "y";
    } else if (day_diff >= 30) {
        return Math.floor(day_diff / 30).toString() + "mo";
    } else if (day_diff >= 7) {
        return Math.floor(day_diff / 7).toString() + "w";
    } else if (day_diff >= 1) {
        return Math.floor(day_diff).toString() + "d";
    } else {
        return "1d";
    }
}

function loadNotificationPane(data) {
    console.log(data);
    var notification_pane = document.getElementById('notification-pane');
    for (var i = 0; i < data.length; i++) {
        var notification = document.createElement("div");
        notification.classList.add("notification");

        // Notification header
        var header = document.createElement("div");
        header.classList.add("notification-header");
        var header_left = document.createElement("h3");
        header_left.innerHTML = data[i]["header_text"];
        var header_right = document.createElement("h4");
        header_right.innerHTML = timeSince(data[i]["date_created"]);
        header.append(header_left);
        header.append(header_right);

        // Notification body
        var body = document.createElement("div");
        body.classList.add("notification-body");
        var data1 = document.createElement("div");
        data1.classList.add("notification-data1");
        var image = document.createElement("img");
        image.setAttribute("src", "/song_images/" + data[i]["song_id"] + ".png");
        image.setAttribute("width", "50px");
        image.setAttribute("height", "50px");
        var data2 = document.createElement("div");
        data2.classList.add("notification-data2");
        var song_name = document.createElement("h5");
        song_name.innerHTML = data[i]["song_name"];
        var artist_name = document.createElement("h5");
        artist_name.innerHTML = data[i]["artist_name"];
        data2.append(song_name);
        data2.append(artist_name);
        data1.append(image);
        data1.append(data2);
        body.append(data1);

        notification.append(header);
        notification.append(body);
        notification_pane.append(notification);
    }
}