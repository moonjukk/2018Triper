var db = null;
var var_no = null;
var position = null;
var index = 0;
var count = 1;
var length;
var myRowid = 1;
var whatLow = 21;
var rowflag = 0;
var photo = "noPhoto";
var cnt;

var cnt = GetComponent("addDeleteButton.js").cnt;

var manageFlag;

// 데이터베이스 생성 및 오픈
function openDB() {
	db = window.openDatabase('TripPlanDB', '1.0', 'TripPlanDB', 1024 * 1024);
	console.log('1_DB 생성...');
	watchPlanList(); //
}

function createData() {
	db.transaction(function(tr) {
		var selectSQL = 'select * from tripdata';
		tr.executeSql(selectSQL, [], function(tr, rs) {
			if (rs.rows.length > 0) {
				
				
				while (myRowid <= whatLow) {// 일단 20개 까지 출력가능
					console.log('와일문 접근');
					
					makeTripData(myRowid);
					// 방명록 출력 // 추후 메인화면에 출력하기
					myRowid++;
				}
			}

		});
	});
}

/// 저장된 데이터 포트폴리오에 출력하기
function makeTripData(myRowid) {
	db.transaction(function(tr) {
		var selectSQL = 'select title, destination, comment, photoCount, photo from tripdata where rowid=?';

		tr.executeSql(selectSQL, [myRowid], function(tr, rs) {

			// 저장된 사진이 없다면 배경화면으로 대체시켜주기
			if (rs.rows.item(0).photo == "undefined") {
				var name = "#mainPhoto" + myRowid;
				$(name).attr('src', 'images/background.png');

				var name = "mainTitle" + myRowid;
				document.getElementById(name).innerHTML = rs.rows.item(0).title;

				var name = "mainDestination" + myRowid;
				var dom = document.getElementById(name);
				dom.innerHTML = rs.rows.item(0).destination;

				var name = "mainComment" + myRowid;
				var dom = document.getElementById(name);
				dom.innerHTML = rs.rows.item(0).comment;

				var name = "#portfolio" + myRowid;
				$(name).css('display', 'inline');
			} else {
				var photoString = rs.rows.item(0).photo;
				var array = new Array();
				array = photoString.split("@");

				var name = "#mainPhoto" + myRowid;
				$(name).attr('src', array[0]);

				var name = "mainTitle" + myRowid;
				document.getElementById(name).innerHTML = rs.rows.item(0).title;

				var name = "mainDestination" + myRowid;
				var dom = document.getElementById(name);
				dom.innerHTML = rs.rows.item(0).destination;

				var name = "mainComment" + myRowid;
				var dom = document.getElementById(name);
				dom.innerHTML = rs.rows.item(0).comment;

				var name = "#portfolio" + myRowid;
				$(name).css('display', 'inline');
			}
		}, function(tr, err) {
			alert('DB오류5 ' + err.message + err.code);
		});
	});
}

// 여행저장 테이블 생성 트랜잭션 실행
function createTable() {

	db.transaction(function(tr) {
		var createSQL = 'create table if not exists tripdata(id text not null, title text not null, comment text, destination text not null, schedule text, money text, start text, path blob, end text, cnt int, photoCount int, photo blob)';

		tr.executeSql(createSQL, [], function() {
			console.log('2_1_테이블생성_sql 실행 성공...');
		}, function() {
			console.log('2_1_테이블생성_sql 실행 실패...');
		});
	}, function() {
		console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
	}, function() {
		console.log('2_2_테이블 생성 트랜잭션 성공...');
	});
}

// 장소별 사진저장 테이블 생성 트랜잭션 실행
function createTable2() {

	db.transaction(function(tr) {
		var createSQL = 'create table if not exists spotphoto(id text not null, spot text not null, photo blob, photoCount int)';

		tr.executeSql(createSQL, [], function() {
			console.log('spotphoto테이블생성_sql 실행 성공...');
		}, function() {
			console.log('spotphoto테이블생성_sql 실행 실패...');
		});
	}, function() {
		console.log('spotphoto테이블 생성 트랜잭션 실패...롤백은 자동');
	}, function() {
		console.log('spotphoto테이블 생성 트랜잭션 성공...');
	});
}

// 데이터 입력 트랜잭션 실행
function saveData() {
   db.transaction(function(tr) {
      var title = $('#titleData').val();
      var destination = $('#destinationData').val();
      var comment = $('#commentData').val();
      var count = 1;
      var photoCount;
      var flag1 = 1;
      var flag2 = 1;
      // 경유지에 사진이 들어갔는지 확인하는 flag
      var schedule = $('#schedule').val();
      var money = $('#money').val();
      var start = $('#start').val();
      var end = $('#end').val();
      var firstCount = 1;
      var secondCount = 1;
      var photo;

      var spotPhoto;
      var photoCount = 0;
      var spotPhotoCount = 0;
      var fullTripPlan;
      var ran = Math.floor(Math.random() * 1000000) + 1;

      while (count <= cnt) {
         var tripPlan = "#path" + count;

         if (count == 1) {
            fullTripPlan = $(tripPlan).val();
         } else {
            fullTripPlan = fullTripPlan + "@" + $(tripPlan).val();
         }
         count++;
      }

      while (firstCount <= 12) {
         while (secondCount <= 10) {
            name = "#displayArea" + firstCount + "_" + secondCount;
            if (($(name).attr('src') != "images/background.png") && ($(name).attr('src') != "")) {
               if (flag1 == 1) {// 업로드한 모든 사진중 첫번째
                  photo = $(name).attr('src');
                  // 이건 모든 사진을 저장하는 포토
                  flag1++;
                  photoCount++;
               } else {
                  photo = photo + "@" + $(name).attr('src');
                  photoCount++;
               }

               if (flag2 == 1) {// 업로드한 스팟의 사진중 첫번째
                  spotPhoto = $(name).attr('src');
                  //하나의 스팟에 사진을 저장하는 포토
                  flag2++;
                  spotPhotoCount++;
               } else {
                  spotPhoto = spotPhoto + "@" + $(name).attr('src');
                  spotPhotoCount++;
               }
            }
            secondCount++;
         }
         saveSpotPhoto(firstCount, spotPhoto, ran, spotPhotoCount, flag2);
         firstCount++;
         secondCount = 1;
         spotPhotoCount = 0;
         flag2 = 1;
      }

      var insertSQL = 'insert into tripdata(id, title, comment, destination, schedule, money, start, path, end, cnt, photo, photoCount) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

      tr.executeSql(insertSQL, [ran, title, comment, destination, schedule, money, start, fullTripPlan, end, cnt, photo, photoCount], function(tr, rs) {
         alert('여행정보가 저장되었습니다>>' + photo);
      }, function(tr, err) {
         alert('DB오류6 ' + err.message + err.code);
      });
   });
}

// 저장장소별로 사진저장하기
function saveSpotPhoto(firstCount, photo, ran, photoCount, flag2) {
   db.transaction(function(tr) {

      var divNum = firstCount;
      var spotPhoto = photo;
      var spotID = ran;
      var spotPhotoCount = photoCount;
      var addPathName = "#path";
      var flag = flag2;
      // 사진이 들어간 장소인지 확인하는 플래그

      if (divNum != 0 && spotPhoto != "undefined") {

         // 출발지
         if (divNum == 1) {
            var spot = $('#start').val();
         }
         // 도착지
         else if (divNum == 12) {
            var spot = $('#end').val();
         }
         // 그외 경유지역
         else {
            divNum--;
            addPathName = addPathName + divNum;
            var spot = $(addPathName).val();
         }

         if (spot != "" && flag > 1) {
            var insertSQL = 'insert into spotphoto(id, spot, photo, photoCount) values(?, ?, ?, ?)';
            tr.executeSql(insertSQL, [spotID, spot, spotPhoto, spotPhotoCount], function(tr, rs) {
               alert('여행정보가 저장되었습니다 / spotID : ' + spotID + ' / spot : ' + spot + ' / photo : ' + spotPhoto + ' / photoCount : ' + spotPhotoCount);
            }, function(tr, err) {
               alert('DB오류6 ' + err.message + err.code);
            });
         }
      }
   });
}

function uploadTest(post) {

	var count = post;

	db.transaction(function(tr) {
		var selectSQL = 'select id, start, path, end, cnt from tripdata where rowid=?';

		tr.executeSql(selectSQL, [count], function(tr, rs) {

			var id = rs.rows.item(0).id;
			var start = rs.rows.item(0).start;
			var path = rs.rows.item(0).path;
			var end = rs.rows.item(0).end;
			var cnt = rs.rows.item(0).cnt;

			uploadAndManage(id);
			// 사진들만 불러오기
			uploadAndManage2(count);
			// 사진 제외한 나머지 정보 불러오기

		}, function(tr, err) {
			alert('DB오류1 ' + err.message + err.code);
		});
	});
}

//db에서 사진들만 불러오는 메소드
function uploadAndManage(id) {
	db.transaction(function(tr) {
		var selectSQL2 = 'select spot, photo, photoCount from spotphoto where id=?';

		tr.executeSql(selectSQL2, [id], function(tr, rs) {

			var count = rs.rows.length;
			var limit = count - 1;

			if (count > 0) {

				for ( i = 0; i < count; i += 1) {
					var spot = rs.rows.item(i).spot;
					var photo = rs.rows.item(i).photo;
					var photoCount = rs.rows.item(i).photoCount;

					if (i == 0) {

						var array = new Array();
						array = photo.split("@");

						var getCount = 1;

						for (var j = 0; j <= photoCount; j++) {
							var getJ = j + 1;
							var getFullName = "#getdisplayArea1_" + getJ;
							$(getFullName).attr('src', array[j]);
							$(getFullName).css('display', 'inline');
							getCount++;
						}

						getCount--;

						for (var g = getCount; g <= 10; g++) {// 10개까지 이미지저장이 가능한 경우
							var getFullName = "#getdisplayArea1_" + g;
							$(getFullName).css('display', 'none');
						}

					} else if (i == limit) {

						var array = new Array();
						array = photo.split("@");

						var getCount = 1;

						for (var j = 0; j <= photoCount; j++) {
							var getJ = j + 1;
							var getFullName = "#getdisplayArea12_" + getJ;
							$(getFullName).attr('src', array[j]);
							$(getFullName).css('display', 'inline');
							getCount++;
						}

						getCount--;

						for (var g = getCount; g <= 10; g++) {// 10개까지 이미지저장이 가능한 경우
							var getFullName = "#getdisplayArea12_" + g;
							$(getFullName).css('display', 'none');
						}

					} else {
						var getNum = i + 1;

						var array = new Array();
						array = photo.split("@");

						var getCount = 1;

						for (var j = 0; j <= photoCount; j++) {
							var getJ = j + 1;
							var getFullName = "#getdisplayArea" + getNum + "_" + getJ;
							$(getFullName).attr('src', array[j]);
							$(getFullName).css('display', 'inline');
							getCount++;
						}

						getCount--;

						for (var g = getCount; g <= 10; g++) {// 10개까지 이미지저장이 가능한 경우
							var getFullName = "#getdisplayArea" + getNum + "_" + g;
							$(getFullName).css('display', 'none');
						}
					}
				}
			} else {
				//alert('검색 결과 사진 없음');

				for (var i = 1; i <= 12; i++) {// 출발지 + 도착지 + 경유지 10곳인 경우
					for (var j = 1; j <= 10; j++) {// 10개까지 이미지저장이 가능한 경우
						var getFullName = "#getdisplayArea" + i + "_" + j;
						$(getFullName).css('display', 'none');
					}
				}
			}
		}, function(tr, err) {
			alert('DB오류1 ' + err.message + err.code);
			console.log("4");
		});
	});
}

//db에서 사진을 제외한 나머지 정보를 받는 메소드
function uploadAndManage2(count) {
	db.transaction(function(tr) {

		var selectSQL2 = 'select title, comment, destination, schedule, money, start, path, cnt, end from tripdata where rowid=?';

		tr.executeSql(selectSQL2, [count], function(tr, rs) {

			$('#gettitleData').val(rs.rows.item(0).title);
			$('#getcommentData').val(rs.rows.item(0).comment);
			$('#getdestinationData').val(rs.rows.item(0).destination);
			$('#getschedule').val(rs.rows.item(0).schedule);
			$('#getmoney').val(rs.rows.item(0).money);
			$('#getstart').val(rs.rows.item(0).start);
			$('#getend').val(rs.rows.item(0).end);
			cnt = rs.rows.item(0).cnt;

			var tmp = 1;
			// 두번째 for문에서 사용할 변수

			if (rs.rows.item(0).cnt > 0) {
				var getcnt = rs.rows.item(0).cnt;
				var path = rs.rows.item(0).path;

				var array = new Array();
				array = path.split("@");

				for (var i = 1; i <= cnt; i++) {
					var getpathContent = "#getpathContent" + i;
					$(getpathContent).css('display', 'inline');
					var getPath = "#getpath" + i;
					j = i - 1;
					$(getPath).val(array[j]);
					tmp++;
				}
			}

			var limit = 10;
			// 경유지 최대설정이 10인 경우

			for (tmp; tmp <= limit; tmp++) {
				var getPath = "#getpath" + tmp;
				$(getPath).val("제발없어져라좀");
				// 값을 초기화시키고
				var getpathContent = "#getpathContent" + tmp;
				$(getpathContent).css('display', 'none');
				// 사용하지않는 부분을 가린다
			}

			getinitMap();

		}, function(tr, err) {
			console.log("4");
		});
	});
}

function deleteData() {
	db.transaction(function(tr) {
		var deleteSQL = 'delete from tripdata';
		tr.executeSql(deleteSQL, [], function(tr, rs) {
			alert('tripdata 테이블이 삭제되었습니다');
			deleteData2();
		}, function(tr, err) {
			alert('DB오류2 ' + err.message + err.code);
		});
	});
}

function deleteData2() {
	db.transaction(function(tr) {
		var deleteSQL = 'delete from spotphoto';
		tr.executeSql(deleteSQL, [], function(tr, rs) {
			alert('spotphoto 테이블이 삭제되었습니다');
			deleteData3();
		}, function(tr, err) {
			alert('DB오류2 ' + err.message + err.code);
		});
	});
}

function deleteData3() {
	db.transaction(function(tr) {
		var deleteSQL = 'delete from accountdata';
		tr.executeSql(deleteSQL, [], function(tr, rs) {
			alert('accountdata 테이블이 삭제되었습니다');
		}, function(tr, err) {
			alert('DB오류2 ' + err.message + err.code);
		});
	});
}

// 데이터 삭제 위한 데이터 검색 트랜잭션 실행
function selectTrip(id) {
	db.transaction(function(tr) {
		var selectSQL = 'select title, destination, comment from tripdata where rowid=?';
		tr.executeSql(selectSQL, [id], function(tr, rs) {
			$('#titleSelect').val(rs.rows.item(0).title);
			$('#titleSelect2').val(rs.rows.item(0).title);
			$('#destinationSelect').val(rs.rows.item(0).destination);
			$('#commentSelect').val(rs.rows.item(0).comment);
			$('#updateID').val(rs.rows.item(0).rowid);
		}, function(tr, err) {
			alert('DB오류3 ' + err.message + err.code);
		});
	});
}

// 데이터 수정 트랜잭션 실행
function updateTripData() {
	db.transaction(function(tr) {
		var title = $('#titleSelect').val();

		var tit = $('#titleSelect2').val();
		var des = $('#destinationSelect').val();
		var com = $('#commentSelect').val();

		var updateSQL = 'update tripdata set title = ?, destination = ?, comment = ? where title = ?';
		tr.executeSql(updateSQL, [tit, des, com, title], function(tr, rs) {
			alert('데이터 수정 완료');
		}, function(tr, err) {
			alert('DB오류4 ' + err.message + err.code);
		});
	});
}

// 랜덤 ID 중복 조회 메소드 (나중에)
function selectTrip(id) {
	db.transaction(function(tr) {
		var selectSQL = 'select title, destination, comment from tripdata where rowid=?';
		tr.executeSql(selectSQL, [id], function(tr, rs) {
			$('#titleSelect').val(rs.rows.item(0).title);
			$('#titleSelect2').val(rs.rows.item(0).title);
			$('#destinationSelect').val(rs.rows.item(0).destination);
			$('#commentSelect').val(rs.rows.item(0).comment);
			$('#updateID').val(rs.rows.item(0).rowid);
		}, function(tr, err) {
			alert('DB오류3 ' + err.message + err.code);
		});
	});
}

// 동적으로 포트폴리오를 생성하려 했으나 다이얼로그 에러로 인한 보류!!
function watchPlanList() {
	db.transaction(function(tr) {
		var i,
		    count,
		    tagList = '';

		var selectSQL = 'select title from tripdata';
		tr.executeSql(selectSQL, [], function(tr, rs) {
			console.log(' 여행 조회... ' + rs.rows.length + '건.');
			/*recordSet = rs;
			if (rs.rows.length > 1) {

				for ( i = 1; i <= rs.rows.length; i += 1) {
					tagList += '<div id="portfolio' + i + '" style="display: none;" class="w3-third w3-container w3-margin-bottom">';
					tagList += '<a href="#portfolio-dialog" onclick="portupload(' + i + ');" class="play-icon popup-with-zoom-anim" > <img id="mainPhoto' + i + '" src="" style="width:100%" class="w3-hover-opacity portfolioPic"> </a>';
					tagList += '<div class="w3-container w3-white">';
					tagList += '<p>';
					tagList += '<b id="portfolioFont"> 제목 : </b>';
					tagList += '<b id="mainTitle' + i + '"></b>';

					tagList += '<a href="#detail-dialog" class="update-ui play-icon popup-with-zoom-anim" onclick="post(' + i + ')">자세히</a>';
					tagList += '<br/>';
					tagList += '<a href="#update-dialog" onclick="" class="update-ui play-icon">본뜨기</a>';

					tagList += '<b id="portfolioFont"> 여행지 : </b>';
					tagList += '<b id="mainDestination' + i + '"></b>';
					tagList += '<br/>';
					tagList += '<b id="portfolioFont"> [ 내용 ] </b>';

					tagList += '<br/><b id="mainComment' + i + '"></b>';
					tagList += '</p>';
					tagList += '</div>';
					tagList += '</div>';
				}
				$('#addPortfolio').html(tagList);

			}*/
		});
	});
}










// 저장된 데이터 포트폴리오에 출력하기
function makeTripData(myRowid) {
	
	db.transaction(function(tr) {
		var selectSQL = 'select title, destination, comment, photoCount, photo from tripdata where rowid=?';

		tr.executeSql(selectSQL, [myRowid], function(tr, rs) {
			
			// 저장된 사진이 없다면 배경화면으로 대체시켜주기
			if (rs.rows.item(0).photo == "undefined") {
				var name = "#mainPhoto" + myRowid;
				$(name).attr('src', 'images/background.png');

				var name = "mainTitle" + myRowid;
				document.getElementById(name).innerHTML = rs.rows.item(0).title;

				var name = "mainDestination" + myRowid;
				var dom = document.getElementById(name);
				dom.innerHTML = rs.rows.item(0).destination;

				var name = "mainComment" + myRowid;
				var dom = document.getElementById(name);
				dom.innerHTML = rs.rows.item(0).comment;

				var name = "#portfolio" + myRowid;
				$(name).css('display', 'inline');
			} else {
				var photoString = rs.rows.item(0).photo;
				var array = new Array();
				array = photoString.split("@");

				var name = "#mainPhoto" + myRowid;
				$(name).attr('src', array[0]);

				var name = "mainTitle" + myRowid;
				document.getElementById(name).innerHTML = rs.rows.item(0).title;

				var name = "mainDestination" + myRowid;
				var dom = document.getElementById(name);
				dom.innerHTML = rs.rows.item(0).destination;

				var name = "mainComment" + myRowid;
				var dom = document.getElementById(name);
				dom.innerHTML = rs.rows.item(0).comment;

				var name = "#portfolio" + myRowid;
				$(name).css('display', 'inline');
			}
		}, function(tr, err) {
			alert('DB오류5 ' + err.message + err.code);
		});
	});
}

// 데이터 삭제 트랜잭션 실행
function deleteTrip(){
   db.transaction(function(tr){
	  var title = $('#gettitleData').val();   
 	  var deleteSQL = 'delete from tripdata where title = ?';      
	  tr.executeSql(deleteSQL, [title], function(tr, rs){    
	     console.log('6_삭제... ');   
	     alert('게시물 ' + $('#gettitleData').val() + ' 이 삭제되었습니다');   	     
	   	 
	   	 $('#gettitleData').val('');
			$('#getcommentData').val('');
			$('#getdestinationData').val('');
			$('#getschedule').val('');
			$('#getmoney').val('');
			$('#getstart').val('');
			$('#getend').val('');
	   	 
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
   });         
}


//원섭
//본뜨기 html에 정보 가져오기
function selectTrip2(id) {
	db.transaction(function(tr) {
		var selectSQL = 'select title, comment, destination, schedule, money, start, end from tripdata where rowid=?';
		tr.executeSql(selectSQL, [id], function(tr, rs) {
			$('#titleSelect2').val(rs.rows.item(0).title);
			$('#commentSelect2').val(rs.rows.item(0).comment);
			$('#destinationSelect2').val(rs.rows.item(0).destination);
			$('#sc').val(rs.rows.item(0).schedule);
			$('#moy').val(rs.rows.item(0).money);
			$('#st').val(rs.rows.item(0).start);
			$('#en').val(rs.rows.item(0).end);
		}, function(tr, err) {
			alert('DB오류7 ' + err.message + err.code);
		});
	});
}

//원섭
//본뜨기html에 경유지 가져오기
function copypath(count) {
	db.transaction(function(tr) {
		var selectSQL = 'select path, cnt from tripdata where rowid=?';

		tr.executeSql(selectSQL, [count], function(tr, rs) {
			var pathString = rs.rows.item(0).path;
			var array = new Array();
			array = pathString.split("@");
			var cnta = rs.rows.item(0).cnt;

			var getCount = 1;

			// 저장된 사진이 없다면 배경화면으로 대체시켜주기
			if (rs.rows.item(0).path == "undefined") {
				$('#getportDisplay1').attr('src', 'background.png'); // 나중에 저장된 이미지가 없습니다 추가해주기!
				$('#getportDisplay1').css('display', 'inline');
				for (var i=2 ; i <=10 ; i++) { // 10개까지 이미지저장이 가능한 경우
					var getFullName = "#getportDisplay" + getCount;
					$(getFullName).css('display','none');
					getCount++;
				}
			} 
			else {
				for (var i = 0; i < rs.rows.item(0).cnt; i++) {
					var getFullName = "#path" + getCount;
					var getFullName2 = "#pathContent" + getCount;
					$(getFullName).val(array[i]);
					$(getFullName2).css('display', 'inline');
					getCount++;
				}
				getCount = rs.rows.item(0).cnt + 1;
				for (var i = getCount; i <=10 ; i++) { // 10개까지 이미지저장이 가능한 경우
					var getFullName = "#getportDisplay" + getCount;
					$(getFullName).css('display','none');
					getCount++;
				}
			}
			
			getinitMap(cnta);
			
		}, function(tr, err) {
			alert('DB오류1 ' + err.message + err.code);
		});
	});
}

//원섭
//서비스html에 경유지 가져오기 
function copypath2(count) {
	db.transaction(function(tr) {
		var selectSQL = 'select path, cnt, photoCount, photo from tripdata where rowid=?';

		tr.executeSql(selectSQL, [count], function(tr, rs) {
			var pathString = rs.rows.item(0).path;
			var array = new Array();
			array = pathString.split("@");

			var getCount = 1;
			var getCount2 = count;
			
			var photoString = rs.rows.item(0).photo;
			var array2 = new Array();
			array2 = pathString.split("@");
			

			// 저장된 사진이 없다면 배경화면으로 대체시켜주기
			// 새로운 사진 테이블 조정해서하기 ㅠ
			if (rs.rows.item(0).photo == "undefined") {
				for(var i=i ; i<=12 ; i++){
					var idid = "#displayArea" + i + "_" + getCount;
					idid = idid + 
					$(idid).attr('src', 'background.png');
					$(idid).css('display','none');
					getCount++;
				}
				//$('#getportDisplay1').attr('src', 'background.png'); // 나중에 저장된 이미지가 없습니다 추가해주기!
				//$('#getportDisplay1').css('display', 'inline');
				for (var i=2 ; i <=10 ; i++) { // 10개까지 이미지저장이 가능한 경우
					var getFullName = "#getportDisplay" + getCount;
					$(getFullName).css('display','none');
					getCount++;
				}
			} 
			else { //경유지 표시 +파란점
				for (var i = 0; i < rs.rows.item(0).cnt; i++) {
					
					if(count == 1){
						var getFullName = "pathpoa" + getCount;
						var dom = document.getElementById(getFullName);
						dom.innerHTML = array[i];
					}
					if(count == 2){
						var getFullName = "pathpob" + getCount;
						var dom = document.getElementById(getFullName);
						dom.innerHTML = array[i];
					}
					if(count == 3){
						var getFullName = "pathpoc" + getCount;
						var dom = document.getElementById(getFullName);
						dom.innerHTML = array[i];
					}
					if(count == 4){
						var getFullName = "pathpod" + getCount;
						var dom = document.getElementById(getFullName);
						dom.innerHTML = array[i];
					}
					if(count == 5){
						var getFullName = "pathpoe" + getCount;
						var dom = document.getElementById(getFullName);
						dom.innerHTML = array[i];
					}
					if(count == 6){
						var getFullName = "pathpof" + getCount;
						var dom = document.getElementById(getFullName);
						dom.innerHTML = array[i];
					}
					if(count == 7){
						var getFullName = "pathpog" + getCount;
						var dom = document.getElementById(getFullName);
						dom.innerHTML = array[i];
					}
					if(count == 8){
						var getFullName = "pathpoh" + getCount;
						var dom = document.getElementById(getFullName);
						dom.innerHTML = array[i];
					}
					if(count == 9){
						var getFullName = "pathpoi" + getCount;
						var dom = document.getElementById(getFullName);
						dom.innerHTML = array[i];
					}
					if(count == 10){
						var getFullName = "pathpoj" + getCount;
						var dom = document.getElementById(getFullName);
						dom.innerHTML = array[i];
					}
					
					var getFullName2 = "#xxx" + getCount2 + " "+"#cir" + getCount;
					//console.log(getFullName2);
					$(getFullName2).css('display', 'inline-block');
					getCount++;
					
				}
				getCount = rs.rows.item(0).cnt + 1;
				for (var i = getCount; i <=10 ; i++) { // 10개까지 이미지저장이 가능한 경우
					var getFullName = "#getportDisplay" + getCount;
					$(getFullName).css('display','none');
					getCount++;
				}
			}
		}, function(tr, err) {
			alert('DB오류1 ' + err.message + err.code);
		});
	});
}

//원섭
//본뜨기 수정
function updateTripData2(row, cntt) {
	db.transaction(function(tr) {
		//var title = $('#titleSelect').val();
		var row1 = row;
		var count = 1;
		var cnt2 = cntt;
		alert(cnt2);

		var tit = $('#titleSelect2').val();
		var des = $('#destinationSelect2').val();
		var com = $('#commentSelect2').val();
		var sc = $('#sc').val();
		var moy = $('#moy').val();
		var str = $('#st').val();
		var end = $('#en').val();
		
		while(count <= cnt2){//cnt2 : copy_services 에서 cnt(경유지 개수)값 가져오기
			var tripPlan = "#path"+count;
			
			if(count==1){
				var fullTripPlan = $(tripPlan).val();
			}
			else {
				fullTripPlan = fullTripPlan + "@" + $(tripPlan).val();
			}
			count++;
		}

		var updateSQL = 'update tripdata set title = ?, destination = ?, comment = ?, schedule = ?, money = ?, start = ?, end = ?, path = ?, cnt = ? where rowid = ?';
		tr.executeSql(updateSQL, [tit, des, com, sc, moy, str, end, fullTripPlan, cnt2, row1], function(tr, rs) {
			alert('데이터 수정 완료');
		}, function(tr, err) {
			alert('DB오류4 ' + err.message + err.code);
		});
	});
}
//원섭
//본뜨기 이미지 수정1
function updateTripData22(row, cnt2) {
	db.transaction(function(tr) {
		var selectSQL = 'select id from tripdata where rowid=?';
		tr.executeSql(selectSQL, [row], function(tr, rs){
			
			var id = rs.rows.item(0).id;
			
			alert(cnt2);//여행지 총 개수
			updatespot(id, cnt2, row);
			
			
		}, function(tr, err) {
			alert('DB오류9 ' + err.message + err.code);
		});		
	});
}
//원섭
//본뜨기 이미지 수정2
function updatespot(id, cnt2, row) {
	var idid=id;

	db.transaction(function(tr) {
		var selectSQL = 'select rowid, id, spot, photo, photoCount from spotphoto where id=?';
		tr.executeSql(selectSQL, [idid], function(tr, rs){
			var len = rs.rows.length;//여행지 ㅣ개수
			var rowid = rs.rows.item(0).rowid;
			//alert(rowid);
			qqq=rowid-1;

			var limit = len-1;	
			
			for(var i = 0 ; i < len ; i++){
				var count = 1;
				if(i==0){//출발
					var photoCount=0;
					while(count<=10){
						var spotPlan = "#displayArea1_"+count;
						if (($(spotPlan).attr('src') != "background.png") && ($(spotPlan).attr('src') != "")){
							if(count==1){
								var fullspotPlan = $(spotPlan).attr('src');
								photoCount++;
							}
							else{
								fullspotPlan = fullspotPlan + "@" + $(spotPlan).attr('src');
								photoCount++;
							}
						}
						count++;
					}
					//var a=i+1;
					qqq++;//rowid값
					//alert(qqq);
					update1(fullspotPlan, photoCount, qqq, idid);

				}
				else if(i==limit){//도착
					var photoCount=0;
					while(count<=10){
						var spotPlan = "#displayArea12_"+count;
						if (($(spotPlan).attr('src') != "background.png") && ($(spotPlan).attr('src') != "")){
							if(count==1){
								var fullspotPlan = $(spotPlan).attr('src');
								photoCount++;
							}
							else{
								fullspotPlan = fullspotPlan + "@" + $(spotPlan).attr('src');
								photoCount++;
							}
						}
						count++;
					}
					
					//var a=i+1;
					qqq++;
					//alert(qqq);
					www=www+qqq;
					update1(fullspotPlan, photoCount, qqq, idid);

				}
				
				else{//경유지
					var a=i+1;
					qqq++;
					//alert(qqq);
					var photoCount=0;
					while(count <= 10){//사진 카운트까지
					var spotPlan = "#displayArea"+a+"_"+count;
					if (($(spotPlan).attr('src') != "background.png") && ($(spotPlan).attr('src') != "")){
							if(count==1){
								var fullspotPlan = $(spotPlan).attr('src');
								photoCount++;
							}
							else{
								fullspotPlan = fullspotPlan + "@" + $(spotPlan).attr('src');
								photoCount++;
							}
						}
				count++;
			}
			update1(fullspotPlan, photoCount, qqq, idid);
		}
	}
			//bbb(idid);	
		}, function(tr, err) {
			alert('DB오류9 ' + err.message + err.code);
		});	
		
	});
}
//원섭
//이미지 업데이트
function update1(fullspotPlan, photoCount, qqq, idid){
	db.transaction(function(tr) {
		var photo = fullspotPlan;
		var b = photoCount;
		var row = qqq;
		var id = idid;
		qqq=row;
		
		// var selectSQL = 'select photo, photoCount from spotphoto where id=?';
		// tr.executeSql(selectSQL, [id], function(tr, rs) {
			// var updateSQL = 'update spotphoto set photo = ?, photoCount = ? where rowid = ?';
			// tr.executeSql(updateSQL, [photo, b, row], function(tr, rs) {
				// alert('데이터 수정 완료');
// 				
			// }, function(tr, err) {
				// alert('DB오류4 ' + err.message + err.code);
			// });
// 
		// }, function(tr, err) {
			// alert('DB오류1 ' + err.message + err.code);
		// });

		var updateSQL = 'update spotphoto set photo = ?, photoCount = ? where rowid = ?';
		tr.executeSql(updateSQL, [photo, b, row], function(tr, rs) {
			alert('데이터 수정 완료');
			
		}, function(tr, err) {
			alert('DB오류4 ' + err.message + err.code);
		});
	});
}

//원섭
//본뜨기에 이미지 저장
function uploadTest22(post) {

	var count = post; // test

	db.transaction(function(tr) {
		var selectSQL = 'select id, start, path, end, cnt from tripdata where rowid=?';

		tr.executeSql(selectSQL, [count], function(tr, rs) {

			var id = rs.rows.item(0).id;
			var start = rs.rows.item(0).start;
			var path = rs.rows.item(0).path;
			var end = rs.rows.item(0).end;
			var cnt = rs.rows.item(0).cnt;
			
			
			//uploadAndManage33(count); // 사진 제외한 나머지 정보 불러오기
			copypath(count);
			
			alert("uploadTest 아이디 : " + id);
			uploadAndManage22(id); // 사진들만 불러오기

		}, function(tr, err) {
			alert('DB오류1 ' + err.message + err.code);
		});
	});
}

//db에서 사진들만 불러오는 메소드
function uploadAndManage22(id) {
	db.transaction(function(tr) {
		var selectSQL2 = 'select spot, photo, photoCount from spotphoto where id=?';

		tr.executeSql(selectSQL2, [id], function(tr, rs) {

			var count = rs.rows.length;
			var limit = count-1;
			
			var a = rs.rows.item(0).photo;
			var b = rs.rows.item(0).photoCount;

			if (count > 0) {

				for ( i = 0; i < count; i += 1) {
					var spot = rs.rows.item(i).spot;
					var photo = rs.rows.item(i).photo;
					var photoCount = rs.rows.item(i).photoCount;

					if (i == 0) {

						var array = new Array();
						array = photo.split("@");

						var getCount = 1;

						for (var j = 0; j <= photoCount; j++) {
							var getJ = j + 1;
							var getFullName = "#displayArea1_" + getJ;
							$(getFullName).attr('src', array[j]);
							$(getFullName).css('display', 'inline');
							getCount++;
						}
						
						getCount--;
						
						for (var g = getCount; g <= 10; g++) {// 10개까지 이미지저장이 가능한 경우
							var getFullName = "#displayArea1_" + g;
							$(getFullName).css('display', 'none');
						}
						
					} else if (i == limit) {

						var array = new Array();
						array = photo.split("@");

						var getCount = 1;

						for (var j = 0; j <= photoCount; j++) {
							var getJ = j + 1;
							var getFullName = "#displayArea12_" + getJ;
							$(getFullName).attr('src', array[j]);
							$(getFullName).css('display', 'inline');
							getCount++;
						}
						
						getCount--;
						
						for (var g = getCount; g <= 10; g++) {// 10개까지 이미지저장이 가능한 경우
							var getFullName = "#displayArea12_" + g;
							$(getFullName).css('display', 'none');
						}
					
					}else {
						var getNum = i + 1;

						var array = new Array();
						array = photo.split("@");

						var getCount = 1;

						for (var j = 0; j <= photoCount; j++) {
							var getJ = j + 1;
							var getFullName = "#displayArea" + getNum + "_" + getJ;
							$(getFullName).attr('src', array[j]);
							$(getFullName).css('display', 'inline');
							getCount++;
						}
						
						getCount--;
						
						for (var g = getCount; g <= 10; g++) {// 10개까지 이미지저장이 가능한 경우
							var getFullName = "#displayArea" + getNum + "_" + g;
							$(getFullName).css('display', 'none');
						}
					}
				}
			} else {
				//alert('검색 결과 사진 없음');
				
				for (var i = 1; i <= 12; i++) {// 출발지 + 도착지 + 경유지 10곳인 경우
					for ( var j=1 ; j<=10 ; j++ ){// 10개까지 이미지저장이 가능한 경우
						var getFullName = "#displayArea" + i + "_" + j;
						$(getFullName).css('display', 'none');
					}
				}
			}
		}, function(tr, err) {
			alert('DB오류1 ' + err.message + err.code);
			console.log("4");
		});
	});
}
