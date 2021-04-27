(function () {
  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    const cols = [
      {
        id: "lastupdatedate",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "type",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "id",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "datetime",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "percentage",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "value",
        dataType: tableau.dataTypeEnum.int,
      },
    ];

    let apiTableSchema = {
      id: "APIDATOS",
      alias: "Data from API",
      columns: cols,
    };

    schemaCallback([apiTableSchema]);
  };

  myConnector.getData = function (table, doneCallback) {
    let tableData = [];
    var i = 0;
    var j = 0;

    $.getJSON(
      "https://apidatos.ree.es/en/datos/demanda/demanda-tiempo-real?start_date=2021-04-26T00:00&end_date=2021-04-26T23:59&time_trunc=hour&geo_trunc=electric_system&geo_limit=peninsular&geo_ids=8741",
      function (resp) {
        var apiData = resp.included;
        for (i = 0, len = apiData.length; i < len; i++) {
          for (j = 0; j < apiData[i].attributes.values.length; j++) {
            var nestedData = apiData[i].attributes.values[j];
            tableData.push({
              datetime: nestedData.datetime,
              percentage: nestedData.percentage,
              value: Number(nestedData.value),
              lastupdatedate: resp.data.attributes["last-update"],
              type: apiData[i].type,
              id: apiData[i].id,
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
  tableau.connectionName = "API Datos";
  tableau.submit();
}