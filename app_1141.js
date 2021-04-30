console.log("This is working!");

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
    var k = 0;
    var today = Date.now().toDateString().slice(0, 16);
    $.getJSON(
      `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${today}&end_date=${today}&time_trunc=day`,
      function (resp) {
        var apiData = resp.included;
        for (i = 0, len = apiData.length; i < len; i++) {
            for (j = 0; j < apiData[i].attributes.values.length; j++) {
                var dic = apiData[i].attributes.values[j];
                tableData.push({
                    datetime: dic.datetime,
                    percentage: dic.percentage,
                    value: Number(dic.value),
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