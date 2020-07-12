var resimler = {} ;
var sesler = {} ;
var blok = { x: 350} ;
var taban = { x: 0} ;
var flappy = {y: 200, hız:0} ;
var oyunbitti = false ;

// Asset yüklemek için kullanılır
function preload() {
    resimler.arkaplan = loadImage("assets/sprites/background-day.png");
    resimler.flappy = [
        loadImage("assets/sprites/bluebird-downflap.png"),
        loadImage("assets/sprites/bluebird-midflap.png"),
        loadImage("assets/sprites/bluebird-upflap.png")
    ] ;
    resimler.taban = loadImage("assets/sprites/base.png") ;
    resimler.üstBlok = loadImage("assets/sprites/pipe-down.png") ;
    resimler.altBlok= loadImage("assets/sprites/pipe-up.png") ;
    resimler.oyunbitti = loadImage("assets/sprites/gameover.png") ;

    sesler.kanat = loadSound("assets/audio/wing.ogg") ;
    sesler.oyunbitti = loadSound("assets/audio/hit.ogg");
}

function setup() {
    createCanvas(288, 512).parent("oyunAlanı") ;
}

function draw() {
    // Arkaplanı çiz
    background(resimler.arkaplan) ;

    // Oyun bittiyse, mesajı göster ve çık
    if (oyunbitti == true) {
        image(resimler.oyunbitti, 50, 220) ; 
        return ;
    }

    // blokları 1 pixel sola kaydır.
    blok.x = blok.x - 1 ;

    // eğer bloklar soldan ekran dışına çıktıysa, tekrar sağa ekranın dışına yerleştir.
    if (blok.x < -60) blok.x = 300;

    // Blokları mevcut konumlarında çiz.
    image(resimler.altBlok, blok.x, 250);
    image(resimler.üstBlok, blok.x, -150) ;


    // Tabanı sola 1 pixel kaydır.
    taban.x = taban.x - 1 ;

    // Eğer taban 48 pixel sola gittiyse, tekrar başa al.
    if ( taban.x < -48) taban.x = 0 ;

    // Taban resmi çiz.
    image(resimler.taban, taban.x, 400);
    

    console.log(frameCount);
    // Kanatların çırpmasını sağla.
    let kanat_durumu = Math.floor(frameCount / 10) % 3 ;
    //let kanat_durumu = frameCount  % 3 ;

    // Yerçekiminden dolayı aşağıya doğru hızı artır.
    flappy.hız += 0.075 ;

    // Hızdan dolayı kuşun y koordinatını güncelle.
    flappy.y = flappy.y + flappy.hız ; 

    // Eğer flappy tabana değdiyse, o zaman tabanda durmasını sağla.
    if (flappy.y > 375) flappy.y = 375 ; 

    // Flappy'i çiz.
    image(resimler.flappy[kanat_durumu], 60, flappy.y) ;

    // Flappy'nin iki bloktan birine çarpıp çarpmadığını kontrol et.
    if ( çarpışmaTesti(60, flappy.y, 34, 24, blok.x, -150, 52, 320 ) ||
          çarpışmaTesti(60, flappy.y, 34, 24, blok.x, 250, 52,320  )) {
        // Çarptıysa, oyun bitmiştir.   
        oyunbitti = true  ;     
        sesler.oyunbitti.play();
    }

}

function keyPressed() {
    // Klavyedeki bir tuşa basında, kuşun hızını yukarıya doğru eşitle.
    flappy.hız  = -2 ; 
    sesler.kanat.play();
}

// İki dikdörtgenin kesişme testi
function çarpışmaTesti(x1, y1, e1, b1, x2, y2, e2, b2) {
    return x1 < x2 + e2 && x2 < x1 + e1  && y1 < y2 + b2 && y2 < y1 + b1  ;
}