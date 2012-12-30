$(document).ready(function() {
    var $list = $('#photo_list');
    $.get('/api/photos', function(data) {
        for (var i = 0; i < data.list.length; i++) {
            var digest = data.list[i];
            var $item = '<li><a href="#">' + digest + '</a></li>';
            $list.append($item);
        }
        $list.click(function(e) {
            e.preventDefault();
            var digest = e.srcElement.innerText;
            var $img = $('<img/>').attr('src', '/api/photos/' + digest);
            var $thumb = $('#selection');
            $thumb.html($img);
        });
    }); 
});
