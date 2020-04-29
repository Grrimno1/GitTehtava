'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password : '',
  database : 'asiakas'
});

module.exports = 
{
    fetchTypes: function (req, res) {  
      connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function(error, results, fields){
        if ( error ){
          console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
          //res.send(error);
          //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
          res.send({"status": 500, "error": error, "response": null}); 
        }
        else
        {
          console.log("Data = " + JSON.stringify(results));
          res.json(results);
          //res.statusCode = 201;
          //res.send(results);
          //res.send({ "status": 768, "error": null, "response": results });
        }
    });
    
    },
    haeAsiakas: function(req, res) {
      console.log("kutsuttiin haeAsiakas")
      let id = req.params.id;
      let q = "SELECT * FROM Asiakas WHERE ";
      if (id != null) {
        q += "avain = " + id;
      }

      connection.query(q, function(error, results, fields) {
        if (error) {
          console.log("Virhe: " + error);
          res.send({"status": 500, "error": error, "response": null});
        }
        else 
        {
          console.log("DATA = " + JSON.stringify(results));
          res.json(results);
        }
      });
    },
    haku: function(req, res) {
      let Nimi = req.query.nimi;
      let Osoite = req.query.osoite;
      let asty = req.query.asty_avain;
      let q = "SELECT * FROM Asiakas";
      
      if (Nimi != null || Osoite != null || asty != null) {
        q+= " WHERE ";
      }
      if (Nimi != null) {
        q += "Nimi LIKE '%" + req.query.nimi + "%' AND ";
      }
      if (Osoite != null) {
        q+= " Osoite LIKE '%" + Osoite + "%' AND ";
      }
      if (asty != null && asty != "") {
        q+= "asty_avain=" + asty;
      }
      
      if((asty == null && Osoite == null) || (Nimi == null && asty == null)) {
        q = q.replace(" AND ", "");
        console.log(q);
      }
      console.log(q);
      
      connection.query(q, function(error, results, fields) {
        if ( error ) {
          console.log("Virhe: " + error);
          res.send({"status": 500, "error": error, "response": null});
        }
        else 
        {
          console.log("Data = " + JSON.stringify(results));
          res.json(results);
        }
      })
    },
    lisaaAsiakas: function(req, res) {
      let Nimi = "", Osoite = "", pnro = "", ptmp = "", asty = "";
      let b = false;
      
      if (Object.keys(req.body).length) 
      {
        console.log("body ei ollut null");
        Nimi = req.body.nimi;
        Osoite = req.body.osoite;
        pnro = req.body.postinro;
        ptmp = req.body.postitmp;
        asty = req.body.asty_avain;
      }
      if (Object.keys(req.query).length == 5) 
      {
        console.log("query ei ollut null");
        Nimi = req.query.nimi;
        Osoite = req.query.osoite;
        pnro = req.query.postinro;
        ptmp = req.query.postitmp;
        asty = req.query.asty_avain;
      }
      
      let dt = new Date();
      var date = dt.getFullYear() + "-" + (dt.getMonth() + 1) +"-" + dt.getDate();
      date = date.toString();
      var q = "INSERT INTO Asiakas (NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) VALUES " 
      if (Nimi != "" && Osoite != "" && pnro != "" && ptmp != "" && asty != "") {
        q += "('" + Nimi + "', '" + Osoite + "', '" + pnro + "', '" + ptmp + "', '" + date +
         "', " + asty + ")";
         console.log(q);
        connection.query(q, function(error, results, fields) {
          if ( error ) {
            console.log("Virhe: " + error);
            res.send({"status":500, "error": error, "response": null})
          }
          else 
          {
            
            console.log("Data = " + JSON.stringify(results));
            res.send("onnistui, lisätyn avain: " + JSON.stringify(results.insertId));
          }
        })
      } else {
        return res.status(400).json({
          Virhe: "Tarkista syötteet."
        })
      }

    },
    poista: function(req, res) {
      let av;
      
      if (req.query != null) 
      {
        av = req.query.avain;
      }
      console.log(av);
      var q = "DELETE FROM Asiakas WHERE Avain=" + av;
      connection.query(q, function(error, results, fields){
        if ( error ) {
          console.log("Virhe: " + error);
          res.send({"status":500, "error:":error, "response":null});
        } 
        else
        {
          res.send("Poistaminen onnistui. Poistetun avain: " + av);
        }
      })
    },
    fetchAll: function(req, res){
        console.log("Body = " + JSON.stringify(req.body));
        console.log("Params = " + JSON.stringify(req.query));
        res.send("Kutsuttiin fetchAll");
    },

    create: function(req, res){
        // Client lähettää POST-moethod:n
        console.log("Data = " + JSON.stringify(req.body));
        res.send("Kutsuttiin create");
    },

    update: function(req, res){
      console.log("kutsuttiin update");
      let id = req.params.id;
      let query = "UPDATE Asiakas SET NIMI = '" + req.body.nimi + "', OSOITE = '" + req.body.osoite
            + "', POSTINRO = '" + req.body.postinro + "', POSTITMP = '" + req.body.postitmp + 
            "', ASTY_AVAIN = " + req.body.asty_avain + " WHERE AVAIN = " + id;
      
      connection.query(query, function(error, results, fields){
        if (error) {
          console.log("Virhe: " + error);
          res.send({"status":500, "error:":error, "response":null});
        }
        else
        {
          console.log("DATA = " + JSON.stringify);
          res.send("Onnistui. Lisättiin: " + JSON.stringify(results));
        }
      })

    },

    delete : function (req, res) {
        // Client lähettää DELETE method:n
        console.log("Body = " + JSON.stringify(req.body));
        console.log("Params = " + JSON.stringify(req.params));
        res.send("Kutsuttiin delete");
    }
}
