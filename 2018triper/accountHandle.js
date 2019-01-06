var db = null;
var var_no = null;
var position = null;
var index = 0;
var count = 1;
var length;
var myRowid = 1;
var whatLow = 30;
var rowflag = 0;
var photo = "noPhoto";
var makeAccountFlag = 1;
var delFlug;

// 데이터베이스 생성 및 오픈
function openAccountDB() {
	db = window.openDatabase('TripPlanDB', '1.0', 'TripAccountDB', 1024 * 1024);
	console.log('1_DB 생성...');
}

// 테이블 생성 트랜잭션 실행
function createAccountTable() {

	db.transaction(function(tr) {
		var createSQL = 'create table if not exists accountdata(name text not null, work text not null, residence text not null, email text not null, phone text not null, photo text not null)';
		
		tr.executeSql(createSQL, [], function() {
			console.log('2_1_테이블생성_sql 실행 성공...');
			tableCheck();
		}, function() {
			console.log('2_1_테이블생성_sql 실행 실패...');
		});
	}, function() {
		console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
	}, function() {
		console.log('2_2_테이블 생성 트랜잭션 성공...');
	});
	
}

// 계정 정보 로드하기
function accountLoad() {
	db.transaction(function(tr) {
		var selectSQL = 'select name, work, residence, email, phone, photo from accountdata where rowid=?';

		tr.executeSql(selectSQL, [1], function(tr, rs) {
			
			document.getElementById("acoountName").innerHTML = rs.rows.item(0).name;
			document.getElementById("acoountWork").innerHTML = rs.rows.item(0).work;
			document.getElementById("acoountResidence").innerHTML = rs.rows.item(0).residence;
			document.getElementById("acoountEmail").innerHTML = rs.rows.item(0).email;
			document.getElementById("acoountPhone").innerHTML = rs.rows.item(0).phone;
			if(rs.rows.item(0).photo != "undefined")
				$('#profilePhoto').attr('src', rs.rows.item(0).photo);
		}, function(tr, err) {
			alert('DB오류_프로필업로드 실패 ' + err.message + err.code);
		});
	});
}

// 테이블에 기본정보가 생성되었는지 확인하는 메소드
function tableCheck() {
	
	db.transaction(function(tr) {
		var selectSQL = 'select * from accountdata';

		tr.executeSql(selectSQL, [], function(tr, rs) {
			
			if (rs.rows.length < 1) { 
      		 	alert('테이블에 데이터가 존재하지않아 생성합니다.');
				createAccountTable2();
       		}  
			
		}, function(tr, err) {
			console.log("12312312312");
		});
	});
	
}

// 테이블 생성 트랜잭션 실행
function createAccountTable2() {
	
	db.transaction(function(tr) {
		var firstMakeAccountSQL = "insert into accountdata(name, work, residence, email, phone, photo) values('이름을수정해주세요', '직장을입력해주세요', '거주지역을입력해주세요', '이메일을입력해주세요', '전화번호를입력해주세요','images/hat.jpg')";

		tr.executeSql(firstMakeAccountSQL, [], function() {
			if(makeAccountFlag==1){
				tr.executeSql(firstMakeAccountSQL, [], function() {
				makeAccountFlag=2;
				console.log('계정 정보 db 입력 완료');
				accountLoad();
			}, function() {
					console.log('2_2_2_2테이블 생성 트랜잭션 실패...롤백은 자동');
				});
			}
		}, function() {
			console.log('2_2_2_2_테이블 생성 트랜잭션 성공...');
		});
	});
	
}

function createAccountData() {
	db.transaction(function(tr) {
		var selectSQL = 'select * from accountdata';
		tr.executeSql(selectSQL, [], function(tr, rs) {
			makeAccountData(1); // 개인사용자용 앱이기때문에 항상 1로 설정;
		});
	});
}

// 데이터 수정 트랜잭션 실행
function updateAccountData() {
	db.transaction(function(tr) {
		
		var name = $('#getacoountName2').val();
		var work = $('#getacoountWork2').val();
		var residence = $('#getacoountResidence2').val();
		var email = $('#getacoountEmail2').val();
		var phone = $('#getacoountPhone2').val();
		var photo = $('#displayProfileArea2').attr('src');

		var updateSQL = 'update accountdata set name = ?, work = ?, residence = ?, email = ?, phone = ?, photo = ? where rowid = ?';
		tr.executeSql(updateSQL, [name, work, residence, email, phone, photo, 1], function(tr, rs) {
			alert('데이터 수정 완료');
		}, function(tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
}


function loadprofile() {

	db.transaction(function(tr) {
		var selectSQL = 'select name, work, residence, email, phone, photo from accountdata where rowid=?';

		tr.executeSql(selectSQL, [1], function(tr, rs) {
			$('#getacoountName').val(rs.rows.item(0).name);
			$('#getacoountWork').val(rs.rows.item(0).work);
			$('#getacoountResidence').val(rs.rows.item(0).residence);
			$('#getacoountEmail').val(rs.rows.item(0).email);
			$('#getacoountPhone').val(rs.rows.item(0).phone);
			$('#displayProfileArea').attr('src', rs.rows.item(0).photo);
		}, function(tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
}

function uploadProfileData() {

	db.transaction(function(tr) {
		var selectSQL = 'select name, work, residence, email, phone, photo from accountdata where rowid=?';

		tr.executeSql(selectSQL, [1], function(tr, rs) {
			$('#getacoountName2').val(rs.rows.item(0).name);
			$('#getacoountWork2').val(rs.rows.item(0).work);
			$('#getacoountResidence2').val(rs.rows.item(0).residence);
			$('#getacoountEmail2').val(rs.rows.item(0).email);
			$('#getacoountPhone2').val(rs.rows.item(0).phone);
			$('#displayProfileArea2').attr('src', rs.rows.item(0).photo);
		}, function(tr, err) {
			alert('DB오류 ' + err.message + err.code);
		});
	});
}

