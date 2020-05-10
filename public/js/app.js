$(document).ready( function() {
  // Getting which user is Signed In (from localStorage) and updating the HTML
  // =============================================================
  $("#user-name").append(`<span class="thumb-sm avatar pull-right m-t-n-sm m-b-n-sm m-l-sm"> 
                             <img src="images/p@icon2.jpg" alt="..."> 
                             <i class="on b-white"></i> 
                          </span>
                            ${localStorage.getItem("anonymus")}`);
  $("#user-signed-in").append(`<span class="pull-right">
                                 <i class="fab fa-teamspeak"></i>
                               </span>  
                               ${localStorage.getItem("anonymus")}`);

  // Making object dynamics
  // =============================================================
  // Function to collapse NavBar
  $(document).on('click','[data-toggle^="class"]', function(e){
    e && e.preventDefault();
    var $this = $(e.target), $class, $target, $tmp, $classes, $targets;
    !$this.data('toggle') && ($this = $this.closest('[data-toggle^="class"]'));
    $class = $this.data()['toggle'];
    $target = $this.data('target') || $this.attr('href');
    $class && ($tmp = $class.split(':')[1]) && ($classes = $tmp.split(','));
    $target && ($targets = $target.split(','));

    $classes && $classes.length && $.each($targets, function(index, value){
      if($classes[index].indexOf('*') !== -1){
        var patt = new RegExp('\\s' + $classes[index].replace(/\*/g,'[A-Za-z0-9-_]+').split(' ').join('\\s|\\s')+'\\s','g');
        $($this).each(function(i, it){
          var cn = ' ' + it.className + ' ';
          while(patt.test(cn)){
            cn = cn.replace(patt, ' ');
          }
          it.className = $.trim(cn);
        });
      }
      ($targets[index] != '#') && $($targets[index]).toggleClass($classes[index]) || $this.toggleClass($classes[index]);
    });
    $this.toggleClass('active');
  });

  // Function to Show Search Input
  $(document).on('click','[data-ride="collapse"] a', function(e){
    var $this = $(e.target), $active;
    $this.is('a') || ($this = $this.closest('a'));
    $active = $this.parent().siblings(".active");
    $active && $active.toggleClass('active').find('> ul:visible').slideUp(200);
    ($this.parent().hasClass('active') && $this.next().slideUp(200)) || $this.next().slideDown(200);
    $this.parent().toggleClass('active');
    $this.next().is('ul') && e.preventDefault();

    setTimeout(function(){
      $(document).trigger('updateNav');
    }, 300);
  });


  // Jquery Functions
  // =============================================================  
  $('#artists').keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13'){
        $('#btn-search').click();

        let artistInput = $('#artists');
        $.post("/api/searchartist", {
          artist: artistInput.val().trim()
        })
          .then(function(data) {

            var Name      = data.artists.items[0].name.toUpperCase();
            var Genre     = data.artists.items[0].genres[0].toUpperCase();
            var userImage = (data.artists.items[0].images[0].url);
            var $image    = $("<img>").attr("src", userImage).attr("style", "height: 250px; width: 250px");
           
            var $Name  = $(`<div class="namer"><b>Artist: </b><span>${Name}</span></div>`);
            var $Genre = $(`<div class="namer"><i>Genre: <span>${Genre}</span></i></div>`);

            // Removes previous search
            $("#name").empty(); 
            $('#img').empty();
            $("#tittle").empty();

            $("#name").append($Name); 
            $('#img').append($image);
            $("#tittle").append($Genre);

            $('#artists').val('');
          })
      }
  });

  $('#songs').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      $('#btn-search').click();

      let songInput = $('#songs');
      $.post("/api/searchsong", {
        song: songInput.val().trim()
      })
        .then(function(data) {

          var Song       = data.tracks.items[0].name.toUpperCase();
          var artistName = data.tracks.items[0].album.artists[0].name.toUpperCase();
          var albumCover = (data.tracks.items[0].album.images[0].url);
          var $image     = $("<img>").attr("src", albumCover).attr("style", "height: 250px; width: 250px");
         
          var $Name    = $(`<div class="namer"><b>Song: </b><span>${Song}</span></div>`);
          var $Artist  = $(`<div class="namer"><b>Artist: </b><span>${artistName}</span></div>`);

          // Removes previous search
          $("#name").empty(); 
          $('#img').empty();
          $("#tittle").empty();

          $("#name").append($Name); 
          $('#img').append($image);
          $("#tittle").append($Artist);

          $('#songs').val('');
        })
    }
});

$('#albums').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    $('#btn-search').click();

    let albumInput = $('#albums');
    $.post("/api/searchalbum", {
      album: albumInput.val().trim()
    })
      .then(function(data) {

        var Name      = data.albums.items[0].artists[0].name.toUpperCase();
        var album     = data.albums.items[0].name.toUpperCase();
        var userImage = (data.albums.items[0].images[0].url);
        var $image    = $("<img>").attr("src", userImage).attr("style", "height: 250px; width: 250px");
       
        var $Name   = $(`<div class="namer"><b>Artist: </b><span>${Name}</span></div>`);
        var $Album  = $(`<div class="namer"><b>Album: </b><span>${album}</span></div>`);

        // Removes previous search
        $("#name").empty(); 
        $('#img').empty();
        $("#tittle").empty();

        $("#name").append($Album); 
        $('#img').append($image);
        $("#tittle").append($Name);

        $('#albums').val('');
      })
  }
});

  
  // Building Customized User Page Dynamically
  // =============================================================
  $("#playlist_1").on('click', function(e){
    event.preventDefault();
    $("#page-target").empty();
    $("#page-target").css("background-color", "#F3F4F8");
    $("#page-target").append(
      `<h2 class="font-thin m-b">Playlist </h2>
      <div class="row row-sm">
        <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
          <div class="item">
            <div class="pos-rlt">
              <div class="item-overlay opacity r r-2x bg-black">
                <i class="center text-center m-t-n far fa-question-circle i-5x"></i>
              </div>
              <a href="">
                <img src="images/p_empty.jpg" alt="..." class="r r-2x img-full">
              </a>
            </div>
            <div class="padder-v">
              <a href="" class="text-ellipsis">? Song</a>
              <a href="" class="text-ellipsis text-xs text-muted">? Artist</a>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-7">
          <h3 class="font-thin">Artists</h3>
          <div class="row row-sm">
            <div class="col-xs-6 col-sm-3">
              <div class="item">
                <div class="pos-rlt">
                  <div class="item-overlay opacity r r-2x bg-black">
                    <i class="center text-center m-t-n far fa-question-circle i-5x"></i>
                  </div>
                  <img src="images/p@icon_empty.jpg" alt="..." class="r r-2x img-full">
                </div>
                <div class="padder-v">
                  <a href="" class="text-ellipsis">? Artist</a>
                  <a href="" class="text-ellipsis text-xs text-muted">? Genre</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-5">
          <h3 class="font-thin">Albums</h3>
          <div class="list-group bg-white list-group-lg no-bg auto">
            <div class="list-group-item clearfix">
              <span class="pull-left thumb-sm avatar m-r">
                <img src="images/p@icon_empty.jpg" alt="...">
              </span>
              <span class="clear">
                <span>? Album</span>
                <small class="text-muted clear text-ellipsis">? Artist</small>
              </span>
            </div>
          </div>
        </div>
      </div>`
    )
  });
  
})
