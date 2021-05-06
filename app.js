$(document).ready(function () {
  var startDate = new Date();
  var endDate = new Date();
  
  startDate.setDate(startDate.getDate() + 0);
  endDate.setDate(endDate.getDate() + 1);
  
  startDate = startDate.toISOString().slice(0, 10);
  endDate = endDate.toISOString().slice(0, 10);
  
  document.getElementById('start-date-one').value = startDate;
  document.getElementById('end-date-one').value = endDate;

  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    const cols = [
      {
        id: "ID",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "Tipologia",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "FechaHora",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "Valor",
        dataType: tableau.dataTypeEnum.int,
      },
      {
        id: "Porcentaje",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "Ultima_actualizacion",
        dataType: tableau.dataTypeEnum.string,
      },
    ];

    let apiTableSchema = {
      id: "REData",
      alias: "Datos de la REData API para estructura-generacion",
      columns: cols,
    };

    schemaCallback([apiTableSchema]);
  };

  myConnector.getData = function (table, doneCallback) {
    let tableData = [];
    var i = 0;
    var j = 0;
    var dateObj = JSON.parse(tableau.connectionData),
            dateString = "start_date=" + dateObj.startDate + "&end_date=" + dateObj.endDate,
            apiCall = "https://apidatos.ree.es/es/datos/"+dateObj.q+"?"+dateString+"&time_trunc="+dateObj.t;
    console.log(apiCall);
    $.getJSON(apiCall,
      function (resp) {
        var apiData = resp.included;
        for (i = 0, len = apiData.length; i < len; i++) {
          for (j = 0; j < apiData[i].attributes.values.length; j++) {
            var nestedData = apiData[i].attributes.values[j];
            tableData.push({
              FechaHora: nestedData.datetime,
              Porcentaje: nestedData.percentage,
              Valor: Number(nestedData.value),
              Ultima_actualizacion: resp.data.attributes["last-update"],
              Tipologia: apiData[i].type,
              ID: apiData[i].id,
            });
          }
        }
        table.appendRows(tableData);
        doneCallback();
      }
    );
  };

  tableau.registerConnector(myConnector);

  $(document).ready(function() {
    $("#submitButton").click(function() {
      if ($("#query option:selected").text() == "Generación") {
        query = "generacion/estructura-generacion";
        period = "day";
      } else if ($("#query option:selected").text() == "Demanda") {
        query = "demanda/demanda-tiempo-real";
        period = "hour";
      }
      var dateObj = {
          startDate: $('#start-date-one').val().trim(),
          endDate: $('#end-date-one').val().trim(),
          q: query,
          t: period,
      };
      tableau.connectionData = JSON.stringify(dateObj);
      tableau.connectionName = "REData";
      tableau.submit(); 
      })
    });
})();