import http from "node:http";

const PORT = Number(process.env.PORT) || 3000;

const shows = [
    { id: 1, movie: "Thalaivar 175", time: "04:00", totalSeats: 300 },
    { id: 2, movie: "Thalaivar 175", time: "09:00", totalSeats: 300 },
  ];

  const bookings: { showId: number; seat: string }[] = [];



const server = http.createServer((req,res)=>{
    console.log(`${req.method} ${req.url}`);

    if(req.method ==="GET" && req.url==="/"){
        res.writeHead(200,{"Content-Type": "text/plain" });
        res.end("FDFS booking is open!\n")
        return;
    }

    if(req.method==="GET" && req.url==="/shows"){
        res.writeHead(200,{"Content-Type": "application/json" });
        res.end(JSON.stringify(shows));
        return;
    }

    if (req.method === "GET" && req.url === "/bookings") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(bookings));
        return;
      }

    if(req.method==="POST" && req.url==="/bookings"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
        })

        req.on("end", ()=>{
            let data;
            try{
                data = JSON.parse(body);
            }catch{
                res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
        return;
            }
           
            const booking = { showId: data.showId, seat: data.seat };
            bookings.push(booking);
            res.writeHead(201,{ "Content-Type": "application/json" });
            res.end(JSON.stringify(booking));
            
        })

        return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    
})

server.listen(PORT,()=>{
    console.log(`Server listening on http://localhost:${PORT}`);
})