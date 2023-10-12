/**
 * Created by cp on 2022/02/22.
 */
import proj4 from 'proj4'
//北京54
let BJ54_JSON = {
  "BJ54_zone_3_25": "2401",
  "BJ54_zone_3_26": "2402",
  "BJ54_zone_3_27": "2403",
  "BJ54_zone_3_28": "2404",
  "BJ54_zone_3_29": "2405",
  "BJ54_zone_3_30": "2406",
  "BJ54_zone_3_31": "2407",
  "BJ54_zone_3_32": "2408",
  "BJ54_zone_3_33": "2409",
  "BJ54_zone_3_34": "2410",
  "BJ54_zone_3_35": "2411",
  "BJ54_zone_3_36": "2412",
  "BJ54_zone_3_37": "2413",
  "BJ54_zone_3_38": "2414",
  "BJ54_zone_3_39": "2415",
  "BJ54_zone_3_40": "2416",
  "BJ54_zone_3_41": "2417",
  "BJ54_zone_3_42": "2418",
  "BJ54_zone_3_43": "2419",
  "BJ54_zone_3_44": "2420",
  "BJ54_zone_3_45": "2421",

  "BJ54_CM_3_25": "2422",
  "BJ54_CM_3_26": "2423",
  "BJ54_CM_3_27": "2424",
  "BJ54_CM_3_28": "2425",
  "BJ54_CM_3_29": "2426",
  "BJ54_CM_3_30": "2427",
  "BJ54_CM_3_31": "2428",
  "BJ54_CM_3_32": "2429",
  "BJ54_CM_3_33": "2430",
  "BJ54_CM_3_34": "2431",
  "BJ54_CM_3_35": "2432",
  "BJ54_CM_3_36": "2433",
  "BJ54_CM_3_37": "2434",
  "BJ54_CM_3_38": "2435",
  "BJ54_CM_3_39": "2436",
  "BJ54_CM_3_40": "2437",
  "BJ54_CM_3_41": "2438",
  "BJ54_CM_3_42": "2439",
  "BJ54_CM_3_43": "2440",
  "BJ54_CM_3_44": "2441",
  "BJ54_CM_3_45": "2442",

  "BJ54_zone_6_13": "21413",
  "BJ54_zone_6_14": "21414",
  "BJ54_zone_6_15": "21415",
  "BJ54_zone_6_16": "21416",
  "BJ54_zone_6_17": "21417",
  "BJ54_zone_6_18": "21418",
  "BJ54_zone_6_19": "21419",
  "BJ54_zone_6_20": "21420",
  "BJ54_zone_6_21": "21421",
  "BJ54_zone_6_22": "21422",
  "BJ54_zone_6_23": "21423",

  "BJ54_CM_6_13": "21453",
  "BJ54_CM_6_14": "21454",
  "BJ54_CM_6_15": "21455",
  "BJ54_CM_6_16": "21456",
  "BJ54_CM_6_17": "21457",
  "BJ54_CM_6_18": "21458",
  "BJ54_CM_6_19": "21459",
  "BJ54_CM_6_20": "21460",
  "BJ54_CM_6_21": "21461",
  "BJ54_CM_6_22": "21462",
  "BJ54_CM_6_23": "21463",

  "BJ54": "4214",

};
//北京54


//北京54--3度带--zone
proj4.defs("EPSG:2401", "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=25500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-25----73.5°E to 76.5°E
proj4.defs("EPSG:2402", "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=26500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-26----76.5°E to 79.5°E
proj4.defs("EPSG:2403", "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=27500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-27----79.5°E to 82.5°E
proj4.defs("EPSG:2404", "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=28500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-28----82.5°E to 85.5°E
proj4.defs("EPSG:2405", "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=29500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-29----85.5°E to 88.5°E
proj4.defs("EPSG:2406", "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=30500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-30----88.5°E to 91.5°E
proj4.defs("EPSG:2407", "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=31500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-31----91.5°E to 94.5°E
proj4.defs("EPSG:2408", "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=32500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-32----94.5°E to 97.5°E
proj4.defs("EPSG:2409", "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-33----97.5°E to 100.5°E
proj4.defs("EPSG:2410", "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=34500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-34----100.5°E to 103.5°E
proj4.defs("EPSG:2411", "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=35500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-35----103.5°E to 106.5°E
proj4.defs("EPSG:2412", "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-36----106.5°E to 109.5°E
proj4.defs("EPSG:2413", "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-37----109.5°E to 112.5°E
proj4.defs("EPSG:2414", "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-38----112.5°E to 115.5°E
proj4.defs("EPSG:2415", "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-39----115.5°E to 118.5°E
proj4.defs("EPSG:2416", "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-40----118.5°E to 121.5°E
proj4.defs("EPSG:2417", "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=41500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-41----121.5°E to 124.5°E
proj4.defs("EPSG:2418", "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=42500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-42----124.5°E to 127.5°E
proj4.defs("EPSG:2419", "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=43500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-43----127.5°E to 130.5°E
proj4.defs("EPSG:2420", "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=44500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-44----130.5°E to 133.5°E
proj4.defs("EPSG:2421", "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=45500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-zone-45----133.5°E to 136.5°E
//北京54--3度带--CM
proj4.defs("EPSG:2422", "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-75E----73.5°E to 76.5°E
proj4.defs("EPSG:2423", "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-78E----76.5°E to 79.5°E
proj4.defs("EPSG:2424", "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-81E----79.5°E to 82.5°E
proj4.defs("EPSG:2425", "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-84E----82.5°E to 85.5°E
proj4.defs("EPSG:2426", "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-87E----85.5°E to 88.5°E
proj4.defs("EPSG:2427", "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-90E----88.5°E to 91.5°E
proj4.defs("EPSG:2428", "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-93E----91.5°E to 94.5°E
proj4.defs("EPSG:2429", "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-96E----94.5°E to 97.5°E
proj4.defs("EPSG:2430", "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-99E----97.5°E to 100.5°E
proj4.defs("EPSG:2431", "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-102E----100.5°E to 103.5°E
proj4.defs("EPSG:2432", "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-105E----103.5°E to 106.5°E
proj4.defs("EPSG:2433", "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-108E----106.5°E to 109.5°E
proj4.defs("EPSG:2434", "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-111E----109.5°E to 112.5°E
proj4.defs("EPSG:2435", "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-114E----112.5°E to 115.5°E
proj4.defs("EPSG:2436", "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-117E----115.5°E to 118.5°E
proj4.defs("EPSG:2437", "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-120E----118.5°E to 121.5°E
proj4.defs("EPSG:2438", "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-123E----121.5°E to 124.5°E
proj4.defs("EPSG:2439", "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-126E----124.5°E to 127.5°E
proj4.defs("EPSG:2440", "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-129E----127.5°E to 130.5°E
proj4.defs("EPSG:2441", "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-132E----130.5°E to 133.5°E
proj4.defs("EPSG:2442", "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs ");  //北京1954-3度分带-高斯克吕格投影-CM-135E----133.5°E to 136.5°E
proj4.defs("EPSG:4547", "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");

//具体的可以到 https://epsg.io/ 进行查询
//西安80
let Xian80_JSON = {}


//平面坐标系 国测平面
let CGCS2000_CM_JSON = { "CGCS2000_CM_3_108": "4545" }


//龙山坐标系   108E
proj4.defs("EPSG:4545", "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");

//经纬度米
let WGS84UTM_JSON = {}

//经纬度
let WGS84_JSON = { "WGS84": "4326" }
proj4.defs("EPSG:4326", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");//北京1954-3度分带-高斯克吕格投影-CM-135E----133.5°E to 136.5°E


let ws200_json = { "WGS84": "4527" }
//"webMercator":  //WGS 84 /伪墨卡托-球形墨卡托，谷歌地图，OpenStreetMap，必应，ArcGIS，ESRI
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");

proj4.defs("EPSG:4527", "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
proj4.defs("EPSG:4541","+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4540","+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4539","+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4538","+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4537","+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4536","+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4535","+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4534","+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");

proj4.defs("EPSG:4542","+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4543","+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4544","+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4545","+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4546","+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4547","+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4548","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4549","+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4550","+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4551","+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4552","+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4553","+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");
proj4.defs("EPSG:4554","+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");




proj4.defs("EPSG:4548_suqian","+proj=tmerc +lat_0=0 +lon_0=118.5 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs");


proj4.defs("EPSG:4548_suqian_qc","+proj=tmerc +lat_0=0 +lon_0=118.5 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=241.6121462381,134.9615704846,27.4989664128,-0.8296300374,2.6648555082,-4.3551505627,-2.81898623266663 +units=m +no_defs +type=crs");

// +proj=utm +zone=32 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs  <>


proj4.defs("EPSG:4490_7c1","+proj=longlat +ellps=GRS80 +no_defs +type=crs");

proj4.defs("EPSG:4490_7c","+proj=longlat +ellps=GRS80 +towgs84=241.6121462381,134.9615704846,27.4989664128,-0.8296300374,2.6648555082,-4.3551505627,-2.81898623266663 +units=m +no_defs +type=crs");



proj4.defs("EPSG:4490","+proj=longlat +ellps=GRS80 +no_defs +type=crs");







export { BJ54_JSON, Xian80_JSON, CGCS2000_CM_JSON, WGS84UTM_JSON, WGS84_JSON, ws200_json }
