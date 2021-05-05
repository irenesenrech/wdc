(function () {
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

    var startDate = new Date();
    var endDate = new Date();

    startDate.setDate(startDate.getDate() + 0);
    endDate.setDate(endDate.getDate() + 1);

    startDate = startDate.toISOString().slice(0, 10);
    endDate = endDate.toISOString().slice(0, 10);

    var dateObj = JSON.parse(tableau.connectionData),
            dateString = "starttime=" + dateObj.startDate + "&endtime=" + dateObj.endDate,
            apiCall = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&" + dateString + "&minmagnitude=4.5";

    $.getJSON(apiCall,
      // `https://apidatos.ree.es/es/datos/generacion/estructura-generacion?start_date=${startDate}T00:00&end_date=${endDate}T00:00&time_trunc=day`,
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
      var dateObj = {
          startDate: $('#start-date-one').val().trim(),
          endDate: $('#end-date-one').val().trim(),
      };
      tableau.connectionData = JSON.stringify(dateObj);
      tableau.connectionName = "REData";
      tableau.submit(); 
      })
    });
})();