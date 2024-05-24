
// Правило выводит в лог состояние переключателей Devices → Discrete I/O → A1_OUT и Devices → Discrete I/O → A2_OUT
defineRule("test_whenChanged", {
  whenChanged: ["/devices/123DIWD14/controls/IN1"], // топики, при изменении которых сработает правило
  then: function (newValue, devName, cellName) {
    log("devName:{}, cellName:{}, newValue:{}", devName, cellName, newValue); // вывод сообщения в лог
    dev["/devices/121DORIG16/controls/K1"] = 0;
  }
});


/ Правило выводит в лог при любом изменении состояния переключателя 123DIWD14/controls/IN1 и при возникновении "1" на входе выдает на реле /devices/121DORIG16/controls/K1 "0" 
// а при возникновении "0" на входе выдает на реле /devices/121DORIG16/controls/K1 "1" 
defineRule("test_whenChanged", {
  whenChanged: ["124DIWD14/IN1"], // топики, при изменении которых сработает правило
  then: function (newValue, devName, cellName) {
    log("devName:{}, cellName:{}, newValue:{}", devName, cellName, newValue); // вывод сообщения в лог
    if (dev["124DIWD14/IN1"] = true) {
        dev["122DORIG16/K1"] = true;
    } else {
       dev["122DORIG16/K1"] = false;
    }
  }
});

var motion_timer_1_timeout_ms = 30 * 1000;
var motion_timer_1_id = null;

defineRule("motion_detector_1", 
{
    whenChanged: "wb-mio-gpio_190:3/IN1",
    then: function (newValue, devName, cellName) 
    {
        if (newValue) 
        {
            dev["wb-mio-gpio_190:1/K1"] = false;
            if (motion_timer_1_id) 
            {
                clearTimeout(motion_timer_1_id);
            }
            motion_timer_1_id = setTimeout(function () 
            {
                dev["wb-mio-gpio_190:1/K1"] = true;
                motion_timer_1_id = null;
            }, motion_timer_1_timeout_ms);
        }
    },
});



function makeMotionDetector(name_detector, timeout_ms, relay_control) {
  var motion_timer_id = null;
  defineRule(name_detector, 
      {
      whenChanged: name_detector,
      then: function(newValue, devName, cellName) 
      {
          if (newValue) 
          {
              dev[relay_control] = false;
              if (motion_timer_id) 
              {
                  clearTimeout(motion_timer_id);
              }

              motion_timer_id = setTimeout(function() 
              {
                  dev[relay_control] = true;
                  motion_timer_id = null;
              }, timeout_ms);
          }
      }
  });
}

makeMotionDetector("123DIWD14/IN1", 50000, "121DOR1G16/K1");
makeMotionDetector("123DIWD14/IN2", 50000, "121DOR1G16/K2");
makeMotionDetector("123DIWD14/IN3", 50000, "121DOR1G16/K3");
makeMotionDetector("123DIWD14/IN4", 50000, "121DOR1G16/K4");
makeMotionDetector("123DIWD14/IN5", 50000, "121DOR1G16/K5");
makeMotionDetector("123DIWD14/IN6", 50000, "121DOR1G16/K6");
makeMotionDetector("123DIWD14/IN7", 50000, "121DOR1G16/K7");
makeMotionDetector("123DIWD14/IN8", 50000, "121DOR1G16/K8");
makeMotionDetector("123DIWD14/IN9", 50000, "121DOR1G16/K9");
makeMotionDetector("123DIWD14/IN10", 50000, "121DOR1G16/K10");
makeMotionDetector("123DIWD14/IN11", 50000, "121DOR1G16/K11");
makeMotionDetector("123DIWD14/IN12", 50000, "121DOR1G16/K12");
makeMotionDetector("123DIWD14/IN13", 50000, "121DOR1G16/K13");
makeMotionDetector("123DIWD14/IN14", 50000, "121DOR1G16/K14");
makeMotionDetector("123DIWD14/IN15", 50000, "121DOR1G16/K15");
makeMotionDetector("123DIWD14/IN16", 50000, "121DOR1G16/K16");

makeMotionDetector("124DIWD14/IN1", 50000, "122DOR1G16/K1");
makeMotionDetector("124DIWD14/IN2", 50000, "122DOR1G16/K2");
makeMotionDetector("124DIWD14/IN3", 50000, "122DOR1G16/K3");
makeMotionDetector("124DIWD14/IN4", 50000, "122DOR1G16/K4");
makeMotionDetector("124DIWD14/IN5", 50000, "122DOR1G16/K5");
makeMotionDetector("124DIWD14/IN6", 50000, "122DOR1G16/K6");
makeMotionDetector("124DIWD14/IN7", 50000, "122DOR1G16/K7");
makeMotionDetector("124DIWD14/IN8", 50000, "122DOR1G16/K8");
makeMotionDetector("124DIWD14/IN9", 50000, "122DOR1G16/K9");
makeMotionDetector("124DIWD14/IN10", 50000, "122DOR1G16/K10");
makeMotionDetector("124DIWD14/IN11", 50000, "122DOR1G16/K11");
makeMotionDetector("124DIWD14/IN12", 50000, "122DOR1G16/K12");
makeMotionDetector("124DIWD14/IN13", 50000, "122DOR1G16/K13");
makeMotionDetector("124DIWD14/IN14", 50000, "122DOR1G16/K14");
makeMotionDetector("124DIWD14/IN15", 50000, "122DOR1G16/K15");



makeMotionDetector("motion_detector_2", 10000, "IN2", "K2");
makeMotionDetector("motion_detector_3", 10000, "IN3", "K3");

121DOR1G16/K1
122DOR1G16/K1
123DIWD14/IN1
124DIWD14/IN1






































defineVirtualDevice("rs485_cmd", {
    title: "Send custom command to RS-485 port",
    cells: {
	enabled: {
	    type: "switch",
	    value: false
	},
    }
});

function setup_port() {
    runShellCommand("stty -F /dev/ttyNSC0 ospeed 9600 ispeed 9600 raw clocal -crtscts -parenb -echo cs8");
}

defineRule("_rs485_switch_on", {
  asSoonAs: function () {
    return dev.rs485_cmd.enabled;
  },
  then: function() {
    runShellCommand("/usr/bin/printf '\\xff\\xff\\x0a\\x01\\xff\\x00\\x00\\x0a' > /dev/ttyNSC0");
  }
});

defineRule("_rs485_switch_off", {
  asSoonAs: function () {
    return !dev.rs485_cmd.enabled;
  },
  then: function() {
    runShellCommand("/usr/bin/printf '\\xff\\xff\\x0a\\x01\\x00\\x00\\x00\\x0b' >/dev/ttyNSC0");
  }
});

setTimeout(setup_port, 1000); // запланировать выполнение setup_port() через 1 секунду после старта правил.


