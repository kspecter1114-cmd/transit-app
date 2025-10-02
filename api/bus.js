export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    try {
        const apiKey = process.env.INCHEON_BUS_API_KEY; // Vercel 환경변수에서 가져오기
        const stationId = '89215';
        
        const response = await fetch(
            `https://apis.data.go.kr/6280000/busArrivalService/getBusArrivalList?serviceKey=${apiKey}&stationId=${stationId}&numOfRows=10&pageNo=1&type=json`
        );
        
        const data = await response.json();
        
        // 701번 버스만 필터링
        const bus701Data = data.response?.body?.items?.filter(item => 
            item.routeNo === '701'
        ) || [];
        
        res.status(200).json({
            success: true,
            data: bus701Data
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: '버스 정보를 가져올 수 없습니다.'
        });
    }
}
