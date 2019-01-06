var cnt = GetComponent("addDeleteButton.js").cnt;
var cnt1;
var array;
// 데이터베이스 생성 및 열기
function openDB() {
	db = window.openDatabase('tripPlanDB', '1.0', '여행DB', 1024 * 1024);
	console.log('1_DB 생성...');

}

// 테이블 생성 트랜잭션 실행
function createTable() {
	db.transaction(function(tr) {
		var createSQL1 = 'create table if not exists tripPlan(title varchar(50), memo varchar(5000), schedule varchar(50), personNum varchar(50), totalMoney varchar(50), eachMoney varchar(50), start varchar(50), path blob, end varchar(50), cnt integer)';

		tr.executeSql(createSQL1, [], function() {
			console.log('2_1_테이블생성_sql 실행 성공...');
		}, function() {
			console.log('2_1_테이블생성_sql 실행 실패...');
		});
	}, function() {
		console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
	}, function() {
		console.log('2_2_테이블 생성 트랜잭션 성공...');
	});

	db.transaction(function(tr) {
		var createSQL = 'create table if not exists tripListIndex(num varchar(10))';

		tr.executeSql(createSQL, [], function() {
			console.log('인덱스테이블생성_sql 실행 성공…');
		}, function() {
			console.log('인덱스테이블생성_sql 실행 실패…');
		});
	}, function() {
		console.log('인덱스테이블 생성 트랜잭션 실패…롤백은 자동');
	}, function() {
		console.log('인덱스테이블 생성 트랜잭션 성공…');
	});
}

// 데이터 입력 트랜잭션 실행
function insertTrip() {
	db.transaction(function(tr) {
		var title = $('#title').val();
		var memo = $('#memo').val();
		var personNum = $('#personNum').val();
		var totalMoney = $('#totalMoney').val();
		var eachMoney = $('#eachMoney').val();
		var schedule = $('#schedule').val();
		var money = $('#money').val();
		var start = $('#start').val();
		var end = $('#end').val();
		var count = 1;

		while (count <= cnt) {
			var tripPlan = "#path" + count;

			if (count == 1) {
				var fullTripPlan = $(tripPlan).val();
			} else {
				fullTripPlan = fullTripPlan + "@" + $(tripPlan).val();
			}
			count++;
		}

		var insertSQL = 'insert into tripPlan(title, memo, schedule, personNum, totalMoney, eachMoney, start, path, end, cnt) values(?,?,?,?,?,?,?,?,?,?)';
		tr.executeSql(insertSQL, [title, memo, schedule, personNum, totalMoney, eachMoney, start, fullTripPlan, end, cnt], function(tr, rs) {
			console.log('3_ 여행 등록');
			alert('여행계획 ' + $('#title').val() + ' 이(가) 입력되었습니다');
			$('#title').val('');
			$('#memo').val('');
			$('#personNum').val('');
			$('#totalMoney').val('');
			$('#eachMoney').val('');
			$('#schedule').val('');
			$('#money').val('');
			$('#start').val('');
			$('#end').val('');
			$(tripPlan).val('');
		}, function() {
			alert('여행계획 ' + $('#title').val() + ' 이(가) 입력 실패하였습니다');
		});
	});

}

function watchPlanList() {
	db.transaction(function(tr) {

		var i;
		var count;
		var tagList = '';

		var selectSQL = 'select * from tripPlan';
		tr.executeSql(selectSQL, [], function(tr, rs) {
			console.log(' 여행 조회... ' + rs.rows.length + '건.');
			recordSet = rs;
			count = rs.rows.length;
			if (count > 0) {

				for ( i = 0; i < count; i += 1) {

					tagList += '<div class="w3-container w3-card w3-white w3-margin-bottom">';
					tagList += '<h2 class="w3-text-grey w3-padding-16">' + rs.rows.item(i).title + '<h2>';
					tagList += '<div class="w3-container">';
					tagList += '<h5 class="w3-opacity"><b>' + rs.rows.item(i).memo + '</b></h5>';
					tagList += '<h5 class="w3-opacity"><b>' + rs.rows.item(i).totalMoney + '$</b></h5>';
					tagList += '<h6 class="w3-text-teal"><i class="fa fa-calendar fa-fw w3-margin-right"></i>' + rs.rows.item(i).schedule + '</h6>';

					tagList += '<button class="BoxModel" onclick="transferTripInfo(' + i + ');">자세히보기</button></div></div>';
				}
				$('#tripListArea').html(tagList);

			}
		});
	});
}

function transferTripInfo(index) {

	db.transaction(function(tr) {
		var rowid = 1;
		var num = index;

		var selectSQL = 'select * from tripListIndex';
		var insertSQL = 'insert into tripListIndex(num) values(?)';
		var updateSQL = 'update tripListIndex set num = ? where rowid = ?';

		tr.executeSql(selectSQL, [], function(tr, rs) {
			if (rs.rows.length == 0) {
				tr.executeSql(insertSQL, [index], function(tr, rs) {
					
					window.open('planDetailWatch.html', "_self");
				});

			} else {
				tr.executeSql(updateSQL, [num, rowid], function(tr, rs) {

					console.log('3_ 여행순위 등록');

					window.open('planDetailWatch.html', "_self");

				});

			}

		});

	});

}

function getDetailWatch() {

	db.transaction(function(tr) {
		var selectSQL1 = 'select * from tripPlan';
		var selectSQL2 = 'select * from tripListIndex';
		var num;
		tr.executeSql(selectSQL2, [], function(tr, rs) {

			num = rs.rows.item(0).num;

		}, function(tr, err) {
			alert('DB오류5 ' + err.message + err.code);
		});

		tr.executeSql(selectSQL1, [], function(tr, rs) {

			start = rs.rows.item(num).start;
			if (rs.rows.item(num).cnt > 0) {

				var path = rs.rows.item(num).path;
				array = new Array();
				array = path.split("@");

			}
			cnt1 = rs.rows.item(num).cnt;

			end = rs.rows.item(num).end;

			document.getElementById('title2').value = rs.rows.item(num).title;
			document.getElementById('schedule2').value = rs.rows.item(num).schedule;
			document.getElementById('personNum2').value = rs.rows.item(num).personNum;
			document.getElementById('totalMoney2').value = rs.rows.item(num).totalMoney;
			document.getElementById('eachMoney2').value = rs.rows.item(num).eachMoney;
			document.getElementById('memo2').value = rs.rows.item(num).memo;

			initMap();
		}, function(tr, err) {
			alert('DB오류5 ' + err.message + err.code);
		});

	});

}

function initMap() {
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	var map = new google.maps.Map(document.getElementById('mapArea2'), {
		zoom : 6,
		center : {
			lat : 41.85,
			lng : -87.65
		}
	});
	directionsDisplay.setMap(map);

	calculateAndDisplayRoute(directionsService, directionsDisplay);

}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
	var waypts = [];
	for (var i = 0; i < cnt1; i++) {

		waypts.push({
			location : array[i],
			stopover : true
		});

	}
	directionsService.route({
		origin : start,
		destination : end,
		waypoints : waypts,
		optimizeWaypoints : true,
		travelMode : 'DRIVING'
	}, function(response, status) {
		if (status == 'OK') {
			directionsDisplay.setDirections(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}

