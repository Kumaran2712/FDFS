import http from "node:http";

const PORT = Number(process.env.PORT) || 3000;

const shows = [
    { id: 1, movie: "Thalaivar 175", time: "04:00", totalSeats: 300 },
    { id: 2, movie: "Thalaivar 175", time: "09:00", totalSeats: 300 },
  ];

  const bookings = new Map<string, { showId: number; seat: string }>();

  const ROWS = "ABCDEFGHIJKLMNO";
const SEATS_PER_ROW = 20;
type Seat = { seat: string; booked: boolean };

function isValidSeat(seat: string): boolean {
  const row = seat[0];
  const num = Number(seat.slice(1));
  return ROWS.includes(row) && Number.isInteger(num) && num >= 1 && num <= SEATS_PER_ROW;
}



const server = http.createServer((req,res)=>{
    const parts = req.url.split('/');
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
        res.end(JSON.stringify([...bookings.values()]));
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

            if(!shows.some((s)=>s.id === data.showId)){
                res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Unknown show" }));
        return;
            }

            if (typeof data.seat !== "string" || !isValidSeat(data.seat)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid seat" }));
                return;
              }
           
            const booking = { showId: data.showId, seat: data.seat };
            const key = `${booking.showId}-${booking.seat}`;
            if (bookings.has(key)) {
                res.writeHead(409, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Seat already booked" }));
                return;
              }
              bookings.set(key, booking);
            res.writeHead(201,{ "Content-Type": "application/json" });
            res.end(JSON.stringify(booking));
            
        })

        return;
    }

    if (req.method === "GET" && parts.length === 4 && parts[1] === "shows" && parts[3] === "seats") {
        const showId = Number(parts[2]);
    
        if (!shows.some((s) => s.id === showId)) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Unknown show" }));
          return;
        }
    
        const seatMap:Seat[][] = [];
    
        for (const row of ROWS) {
          const rowSeats:Seat[] = [];
    
          for (let num = 1; num <= SEATS_PER_ROW; num++) {
            const seat = `${row}${num}`;
            rowSeats.push({ seat: seat, booked: bookings.has(`${showId}-${seat}`) });
          }
    
          seatMap.push(rowSeats);
        }
    
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(seatMap));
        return;
      }   
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    
})

server.listen(PORT,()=>{
    console.log(`Server listening on http://localhost:${PORT}`);
})