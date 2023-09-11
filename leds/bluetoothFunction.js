class PettsLEDs {

    constructor() {
      this.device = null;
      this.onDisconnected = this.onDisconnected.bind(this);
    }
    
    request() {
      let options = {
        "filters": [{
          "namePrefix": "PETTS"
        }],
        "optionalServices": ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"]
      };
      return navigator.bluetooth.requestDevice(options)
      .then(device => {
        this.device = device;
        this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
      });
    }
    
    connect() {
      if (!this.device) {
        return Promise.reject('Device is not connected.');
      }
      return this.device.gatt.connect();
    }
    
    writeColorForRange(color, range_start, range_stop, brightness) {
        let view8 = new Uint8Array(6);
        view8[0] = brightness;
        view8[1] = range_start;
        view8[2] = range_stop;
        view8[3] = color.red;
        view8[4] = color.green;
        view8[5] = color.blue;
      return this.device.gatt.getPrimaryService("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
      .then(service => service.getCharacteristic("beb5483e-36e1-4688-b7f5-ea07361b26ac"))
      .then(characteristic => characteristic.writeValue(view8));
    }

    disconnect() {
      if (!this.device) {
        return Promise.reject('Device is not connected.');
      }
      return this.device.gatt.disconnect();
    }

    onDisconnected() {
      alert('Device is disconnected.');
      $('.connected').hide();
      $('.disconnected').show();
    }
  }
  function hex_color_to_rgb(hex_color)
  {
    const r = parseInt(hex_color.substr(1,2), 16)
    const g = parseInt(hex_color.substr(3,2), 16)
    const b = parseInt(hex_color.substr(5,2), 16)
    return {"red":r, "green":g, "blue":b};
  }

  $(document).ready(function(){
      var pettsLEDs = new PettsLEDs();
      $('.disconnected').show();
      $('.connected').hide();
      $(".color_picker_hex").change(function(event){
        let val = $(this).val();
        if(val.length == 6 && val[0] != "#" || val.length == 7 && val[0] == "#")
        {
          let new_value = val;
          if(val[0] != "#")
          {
            new_value = "#" + val;
          }
          $("#"+$(this).attr("data-for")).val(new_value)
        }
      });
      $('input[type="color"]').change(function(event){
        $('.color_picker_hex[data-for="'+$(this).attr("id")+'"]').val($(this).val())
      });

      $("#connect_button").click(function(e){
          e.preventDefault();
          pettsLEDs.request()
            .then(_ => pettsLEDs.connect())
            .then(_ => { 
                pettsLEDs.writeColorForRange({"red":255,"green":255,"blue":0},0,39,255)
            })
            .then(_ =>
            {
                $('.connected').show();
                $('.disconnected').hide();
            })
            .catch(error => { alert(error) });
      });
       $('#send_colors').click(function(e){
           e.preventDefault();
           let color = hex_color_to_rgb($('#color_1').val());
           let min = $('#min_led').val();
           let max = $('#max_led').val();
           let brightness = $('#brightness').val();
           pettsLEDs.writeColorForRange(color, min, max, brightness);
       });
       $('#phase1').click(function(e){
        e. preventDefault();
        let 
       })

  });