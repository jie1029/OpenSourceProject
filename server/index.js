const express = require("express");
const app = express();
const fs = require("fs");
const axios = require("axios");
const session = require("express-session");
const server = app.listen(3000, function() {
  console.log("Listening on port *: 3000");
});
const request = require("request");

const io = require("socket.io")(server);

const dialogflow = require("dialogflow");
const keyFile = JSON.parse(fs.readFileSync("key.json"));

const projectId = keyFile["project_id"];
const privateKey = keyFile["private_key"];
const clientEmail = keyFile["client_email"];

console.log(projectId, privateKey, clientEmail);
// Instantiates a session client
let config = {
  credentials: {
    private_key: privateKey,
    client_email: clientEmail
  }
};
const sessionClient = new dialogflow.SessionsClient(config);
//이까지가 세션 클라이언트를 만들기 위한 코드

app.use(express.static("dist"));

var members = new Array();
var socketarray = new Array();
var warning_table = [
  "시발",
  "ㅅㅂ",
  "씨발",
  "닥쳐",
  "병신",
  "새끼",
  "ㅗ",
  "ㅄ",
  "ㅅ ㅂ",
  "ㅂ ㅅ",
  "ㅅ1ㅂ",
  "시1발",
  "느금",
  "니미",
  "니애미",
  "미친",
  "ㅁㅊ"
];

var festival_request_table = [];
var kakao_token_table = [];

io.on("connection", socket => {
  console.log(socket.client.id); // Prints client socket id
  //console.log(socket.id);

  socket.on("chat-name", data => {
    //챗봇 이름 물어볼때

    data = "시저리라고 해요!";
    io.emit("chat-name", data); //챗봇 이름 보내주기
  });

  socket.on("chat-member", () => {
    //챗봇에게 누구있는지 물어볼때
    var mem = "";
    for (var i = 0; i < members.length; i++) {
      mem = mem + members[i] + " ";
    }
    mem += "님이 있어요!";
    io.emit("chat-member", mem);
  });

  var check = 0;
  socket.on("chat-message", data => {
    //console.log(data);

    for (var i = 0; i < warning_table.length; i++) {
      if (data.message.indexOf(warning_table[i]) > -1) {
        check = 1;
      }
    }

    if (check) {
      //욕설이 있을 경우
      check = 0;
      var num = 7 - Number(data.warningStatus);
      data.message = num + "번 더 욕하면 벤 당한다!!!!!";

      if (data.group == "nomal") {
        var options = {
          uri: "http://202.31.200.140/add_warning.php",
          method: "POST",
          form: {
            nick: data.nick
          },
          json: true
        };
      } else {
        var options = {
          uri: "http://MYIP/add_warning_kakao.php",
          method: "POST",
          form: {
            nick: data.nick
          },
          json: true
        };
      }
      //일반 카카오 구분, warning추가 닉변추가
      request.post(options, function(err, res, body) {
        data.warningStatus = body.warning;

        io.to(socket.id).emit("warning", data);
      });

      //io.to(socket.id).emit('warning',data);//욕설을 했는지 알려주기,,
      // console.log("세 "+i++);
    } else {
      socket.broadcast.emit("chat-message", data);

      if (data.message.includes("시저리")) {
        tryDF(data.message);
      }
    }

    async function tryDF(data) {
      //123456789는 세션아이디
      let response = await detectIntent(
        projectId,
        socket.client.id,
        data,
        "ko-KR"
      );

      console.log("response:" + response.queryResult.fulfillmentText);
      

      var res = response.queryResult.fulfillmentText;
      if(res!="님이 있어요")
      io.emit("chat-message", {
        message: res,
        nick: "시저리"
      });

      let payload = response.queryResult.fulfillmentMessages.find(elem => {
        return elem.message === "payload";
      });

      if (payload) {
        payload = payload.payload;
        let req = payload.fields.request.stringValue;

        if (req == "festival") {
          let date = payload.fields.Date.stringValue;
          let location = payload.fields.Location.stringValue;

          reqFestival(date, location);
          festival_request_table.splice(0);
        }

        if (req == "add") {
          let fid = payload.fields.festivalNum.stringValue;
          let check = 0;
          for (var i = 0; i < festival_request_table.length; i++) {
            if (festival_request_table[i] == fid) check = 1;
          }

          if (!check) {
            io.emit("chat-message", {
              message: "뭐야! 그런 축제 없잖아요!",
              nick: "시저리"
            });
          } else {
            addFestival(fid);
          }
        
        }
        if(req=="search"){
          let fid = payload.fields.Search_Num.stringValue;
          io.to(socket.client.id).emit("fes_search",fid);
        }

        if(req=="IsAnyoneHere"){
            var mem = "";
            for (var i = 0; i < members.length; i++) {
              mem = mem + members[i] + " ";
            }
            mem += "님이 있어요!";
            io.emit("chat-member", mem);
        }
      }
    }
  });

  function addFestival(fid) {
    let options = {
      uri: "http://MYIP/add_calendar.php",
      method: "POST",
      form: {
        fid: fid
      },
      json: true
    };
    request.post(options, function(err, res, body) {
      console.log(body);

      if (body != "NO") {
        io.emit("chat-message", {
          message: "추가됐어요!",
          nick: "시저리"
        });
        for(var i =0; i<kakao_token_table.length; i++){
          console.log("카카오 테이블 확인");
          console.log(kakao_token_table[i]);
          kakaoMessageReq(kakao_token_table[i],body);
        }
        showCalendar();
      } else
        io.emit("chat-message", {
          message: "이미 추가되어 있어요!",
          nick: "시저리"
        });
    });
  }

  function showCalendar() {
    let options = {
      uri: "http://MYIP/show_calendar.php",
      json: true
    };
    request.get(options, function(err, res, body) {
      if (body.list != null) {
        console.log(body.list);
        io.emit("showCalendar", body.list);
      }
    });
  }


  var myVar="";
  var noti_check=0;
  var d=new Date();
  var t=d. getMinutes();

  socket.on("calendar_check", data => {
    console.log("calendar_check");
    noti_check=0;
    d=new Date();
    t=d.getMinutes();
    myVar=setInterval(function(){
      console.log(t);
      if(String(t)=="0"){
        console.log("시간돼쑴");
        io.emit("noti", "");
    }
    d=new Date();
    t=d.getMinutes();
    },60000);

  });

  function reqFestival(date, location) {
    let options = {
      uri: "http://MYIP/test/search.php",
      method: "GET",
      qs: {
        date: date,
        place: location
      },
      json: true
    };
    request.get(options, function(err, res, body) {
      console.log("festival 리퀘받음");

      //console.log(body);
      if (body.list == null)
        io.emit("chat-message", {
          message: "해당하는 축제가 없습니다!",
          nick: "시저리"
        });
      else {
        let data = [];

        for (var i = 0; i < body.list.length; i++) {
          let temp = {};
          let item = body.list[i];
          temp.id = item._id;

          festival_request_table.push(item._id);

          temp.name = item.name;
          temp.location = item.location;
          temp.start = item.start_date;
          temp.end = item.end_date;
          if (item.content == null) temp.content = "등록된 상세내용이 없습니다";
          else temp.content = item.content;
          if (item.organiser == null)
            temp.organiser = "등록된 주최기관이 없습니다";
          else temp.organiser = item.organiser;
          if (item.tell == null) temp.tell = "등록된 전화번호가 없습니다";
          else temp.tell = item.tell;
          if (item.homepage == null) temp.site = "등록된 홈페이지가 없습니다";
          else temp.site = item.homepage;
          if (item.detail == null) temp.hashTag = "등록된 해쉬태그가 없습니다";
          else temp.hashTag = item.detail;
          if (item.road_address == null)
            temp.roadAddress = "등록된 도로명주소가 없습니다";
          else temp.roadAddress = item.road_address;
          if (item.land_address == null)
            temp.landAddress = "등록된 지번주소가 없습니다";
          else temp.landAddress = item.land_address;
          data[i] = temp;
        }

        io.emit("festivalList", data);
      }
    });
  }
  function kakaoMessageReq(data,info){
    var address = "";
    if(info.road_address == null) address = info.land_address;
    else address = info.road_address;
    console.log("넘어온거 확인");
    console.log(info.name);
    let template_objectObj = {
      "object_type":"location",
      "address":address,
      "address_title":info.name,
      "content":{
        "title":info.name,
        "description":info.detail,
        "image_url":"http://k.kakaocdn.net/dn/d0gAdw/btqzXhOTKxQ/TLz7n4h3aPYq14GraBDxJ0/kakaolink40_original.png",
        "link":{
          "mobile_web_url":"https://developers.kakao.com",
          "web_url":"https://developers.kakao.com"
        }
      },
      "social":{
        "like_count":286,
        "comment_count":45,
        "shared_count":845
      },
      "buttons":[
        {
          "title":"시저리로 이동",
          "link":{
            "mobile_web_url":"https://774e5ee9.ngrok.io",
            "web_url":"https://774e5ee9.ngrok.io"
          }
        }
        
      ]
    };
    let template_objectStr = JSON.stringify(template_objectObj);
    let options = {
      url:'https://kapi.kakao.com/v2/api/talk/memo/default/send',
      method: 'POST',
      headers:{
        'Authorization': 'Bearer '+data.token
      },
      form:{
        template_object:template_objectStr
      }
    };

    request.post(options, function(err, res, body) {
      console.log("카카오메세지전송요청");
      console.log(body);
    });

  }
  socket.on("setToken",data=>{
    let temp = {};
    temp.socketId = socket.client.id;
    console.log("토큰값");
    console.log(data.access_token);
    temp.token = data.access_token
    kakao_token_table.push(temp);
    //test(data);
  });
  socket.on("reqCalendar", data => {
    showCalendar();
  });

  socket.on("isTyping", data => {
    //유저 타이핑중일때

    //data.user = users[socket.client.id];
    //console.log(data);
    io.emit("isTyping", data);
  });

  var check = 0;

  socket.on("new-user", data => {
    //유저 입장
    // console.log(data);

    console.log(socket.client.id);
    for (var i = 0; i < members.length; i++)
      if (members[i] == data.nick) check++;

    if (check == 0) members.push(data.nick);

    socketarray.push({
      socketid: socket.client.id,
      userNick: data.nick
    });

    var userNick = data.nick;
    var temp = userNick + "님이 입장하셨어요!";
    data.nick = "시저리";
    data.message = temp;

    io.emit("new-user", data); //입장하셨어요!
  });

  socket.on("setNick", data => {
    let options = {
      uri: "http://MYIP/change_nick_kakao.php",
      method: "POST",
      form: {
        id: data.id,
        nick: data.nick
      },
      json: true
    };
    request.post(options, function(err, res, body) {
      if (body == "YES") {
        data.status = "YES";
        data.warning = 0;
        io.to(socket.client.id).emit("KaKaoNewUserNick", data);
      } else {
        io.to(socket.client.id).emit("changeNickFail", body);
      }
    });
  });

  socket.on("changeNick", data => {
    //닉네임변경
    console.log("닉네임 변경 요청");

    if (data.group == "nomal") {
      var options = {
        uri: "http://MYIP/change_nick.php",
        method: "POST",
        form: {
          id: data.id,
          nick: data.newNick
        },
        json: true
      };
    } else {
      var options = {
        uri: "http://MYIP/change_nick_kakao.php",
        method: "POST",
        form: {
          id: data.id,
          nick: data.newNick
        },
        json: true
      };
    }
    request.post(options, function(err, res, body) {
      if (body == "YES") {
        var originNick = data.originNick;
        var temp = "닉네임 변경 : " + originNick + " -> " + data.newNick;
        console.log(members);

        for (var i = 0; i < members.length; i++) {
          if (members[i] == data.originNick) members[i] = data.newNick;

          console.log(members);
        }
        io.to(socket.client.id).emit("changeNick", data);
        data.message = temp;
        data.nick = "시저리";
        io.emit("chat-message", data);
      } else {
        io.to(socket.client.id).emit("changeNickFail", body);
      }
    });
  });

  socket.on("setMembers", () => {
    //로그인했을때 list띄울 항목

    io.emit("setMembers", members);
  });

  socket.on("disconnect", () => {
    var nick = "";
    for (var i = 0; i < socketarray.length; i++) {
      if (socketarray[i].socketid == socket.client.id) {
        nick = socketarray[i].userNick;
      }
    }
    members.splice(members.indexOf(nick), 1);
    console.log(members);
  });

  socket.on("commit_logout", data => {
    members.splice(members.indexOf(data.nick), 1);

    var temp = data.nick + "님이 퇴장하셨어요!";
    data.message = temp;
    io.emit("logout", data);
  });

  socket.on("login_user", data => {
    console.log("로그인 요청");

    let options = {
      uri: "http://MYIP/login.php",
      method: "POST",
      form: {
        id: data.id,
        password: data.password
      },
      json: true
    };

    request.post(options, function(err, res, body) {
      console.log(body);
      if (body.status == "No") {
        //console.log("no로 들어옴")
        io.to(socket.id).emit("login_fail", { message: "fail" });
      } else {
        if (body.warning > 7) {
          io.to(socket.id).emit("login_fail", { message: "warning" });
        } else {
          body.group = data.group;
          io.to(socket.id).emit("login_success", body);
        }
      }
    });
  });
  socket.on("kakaoLoginRequest", data => {
    console.log(data);
    console.log("카카오로그인 요청");
    let options = {
      uri: "http://MYIP/kakao_login.php",
      method: "POST",
      form: {
        id: data.id
      },
      json: true
    };
    request.post(options, function(err, res, body) {
      console.log(body);
      if (body.status == "new") {
        body.group = data.group;
        io.to(socket.id).emit("kakaoNewUser", body);
      } else {
        if (body.warning > 7) {
          io.to(socket.id).emit("login_fail", { message: "warning" });
        } else {
          body.group = data.group;
          io.to(socket.id).emit("login_success", body);
        }
      }
    });
  });
  socket.on("join_request", data => {
    console.log(data);
    if (data.password != data.passwordcheck) {
      data.joinStatus = "password";
      io.to(socket.id).emit("join_fail", data.joinStatus);
    } else {
      let options = {
        uri: "http://MYIP/join.php",
        method: "POST",
        form: {
          id: data.userid,
          pw: data.password,
          name: data.name
        },
        json: true
      };
      request.post(options, function(err, res, body) {
        console.log(body.joinStatus);
        if (body.joinStatus == "OK") {
          io.to(socket.id).emit("join_success", body.joinStatus);
        } else {
          io.to(socket.id).emit("join_fail", body.joinStatus);
        }
      });
    }
  });
});

async function detectIntent(projectId, sessionId, query, languageCode) {
  // The path to identify the agent that owns the created intent.
  //세션 정보를 만들기 위한 것
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode
      }
    }
  };

  // if (contexts && contexts.length > 0) {
  //   request.queryParams = {
  //     contexts: contexts,
  //   };
  // }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}
