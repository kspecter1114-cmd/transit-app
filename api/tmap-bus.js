export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { stationId } = req.query;
    
    try {
        const tmapApiKey = 'yGeL6OOUrLavfmnQjva6L7aBAlPPRn8O2ZhJeJQu';
        
        // 티맵 대중교통 정류장 정보 API
        const response = await fetch(
            `https://apis.openapi.sk.com/transit/routes/sub?version=1&format=json&appKey=${tmapApiKey}&stationID=${stationId}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );
        
        const data = await response.json();
        
        if (data.result && data.result.busArrivalList) {
            // 티맵 API 응답을 기존 형식에 맞게 변환
            const buses = data.result.busArrivalList.map(bus => ({
                routeNo: bus.busRouteAbrv || bus.busRouteNm,
                predictTime1: bus.predictTime || Math.floor(bus.predictTime / 60),
                stationNm: bus.stationNm
            }));
            
            res.status(200).json({
                success: true,
                data: buses,
                source: 'tmap'
            });
        } else {
            res.status(200).json({
                success: false,
                error: '버스 정보를 찾을 수 없습니다.'
            });
        }
        
    } catch (error) {
        console.error('티맵 API 오류:', error);
        res.status(500).json({
            success: false,
            error: '버스 정보를 가져올 수 없습니다.'
        });
    }
}
