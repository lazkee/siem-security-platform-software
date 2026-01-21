console.clear();
import app from './app';


const PORT = Number(process.env.PORT ?? 4010);

app.listen(PORT, () => {
  console.log(`security-maturity-service listening on port ${PORT}`);
});
