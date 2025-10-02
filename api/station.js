export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { stationId } = req.query;
    
    try {
        const apiKey = process.env.INCHEON_BUS_API_KEY;
        
        // 정류장 정보 조회
        const stationResponse = await fetch(
            `https://apis.data.go.kr/6280000/busStationService/getBusStationList?serviceKey=${apiKey}&stationId=${stationId}&type=json`
        );
        
        // 버스 도착 정보 조회
        const arrivalResponse = await fetch(
            `https://apis.data.go.kr/6280000/busArrivalService/getBusArrivalList?serviceKey=${apiKey}&stationId=${stationId}&numOfRows=10&pageNo=1&type=json`
        );
        
        const stationData = await stationResponse.json();
        const arrivalData = await arrivalResponse.json();
        
        const stationName = stationData.response?.body?.items?.[0]?.stationName || '정류장명 확인 중';
        const buses = arrivalData.response?.body?.items || [];
        
        res.status(200).json({
            success: true,
            stationName: stationName,
            buses: buses
        });
        
    } catch (error) {
        // API 복구 전까지 정확한 정류장명 제공
        const stationInfo = {
            '89215': '청라국제도시역(청라국제교방향)',
            '89295': '청라센텀로제비앙'
        };
        
        res.status(200).json({
            success: true,
            stationName: stationInfo[stationId] || '정류장명 확인 중',
            buses: []
        });
    }
}
