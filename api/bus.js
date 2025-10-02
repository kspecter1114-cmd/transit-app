export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { stationId } = req.query;
    
    try {
        // 인천 버스정보 API 먼저 시도
        const incheonApiKey = '766d516b636b73703837474e547a4f';
        
        const incheonResponse = await fetch(
            `http://apis.data.go.kr/6280000/busArrivalService/getBusArrivalList?serviceKey=${incheonApiKey}&stationId=${stationId}&numOfRows=10&pageNo=1&type=json`
        );
        
        const incheonData = await incheonResponse.json();
        
        if (incheonData.response?.body?.items && incheonData.response.body.items.length > 0) {
            res.status(200).json({
                success: true,
                data: incheonData.response.body.items,
                source: 'incheon'
            });
            return;
        }
        
        // 인천 API 실패시 경기데이터드림 API 시도
        const gyeonggiApiKey = '2c053a23c110494cb6c99aaf7049a50b';
        
        const gyeonggiResponse = await fetch(
            `https://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList?serviceKey=${gyeonggiApiKey}&stationId=${stationId}&numOfRows=10&pageNo=1&type=json`
        );
        
        const gyeonggiData = await gyeonggiResponse.json();
        
        if (gyeonggiData.response?.body?.items && gyeonggiData.response.body.items.length > 0) {
            res.status(200).json({
                success: true,
                data: gyeonggiData.response.body.items,
                source: 'gyeonggi'
            });
            return;
        }
        
        res.status(200).json({
            success: false,
            error: '버스 정보를 찾을 수 없습니다.'
        });
        
    } catch (error) {
        console.error('버스 API 오류:', error);
        res.status(500).json({
            success: false,
            error: '버스 정보를 가져올 수 없습니다.'
        });
    }
}
