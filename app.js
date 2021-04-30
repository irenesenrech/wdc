console.log("¡Funciona!");

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
    var today = Date.now();
    var formatted_today=today.toDateString().slice(0, 16);
    var last_year_today = new Date(today.getFullYear() - 1, today.getMonth() + 1, today.getDate());
    var formatted_last_year_today = last_year_today.toDateString().slice(0, 16);
    $.getJSON(
      "https://apidatos.ree.es/es/datos/generacion/estructura-generacion?start_date=2"+formatted_last_year_today+"&end_date="+formatted_today+"&time_trunc=day",
      function (resp) {
        var apiData = resp.included;
        // Iterate over the JSON object
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
})();

document.querySelector("#getData").addEventListener("click", getData);

function getData() {
  tableau.connectionName = "REData";
  tableau.submit();
}
