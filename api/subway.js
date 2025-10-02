export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { station } = req.query;
    
    try {
        const apiKey = '5047614f4c6b737037315850426b63';
        
        // 서울교통공사 실시간 지하철 도착정보 API
        const response = await fetch(
            `http://swopenapi.seoul.go.kr/api/subway/${apiKey}/json/realtimeStationArrival/1/10/${encodeURIComponent(station)}/`
        );
        
        const data = await response.json();
        
        if (data.realtimeArrivalList) {
            let filteredTrains = data.realtimeArrivalList;
            
            // 역별 필터링
            if (station === '동대문역사문화공원') {
                // 4호선만 필터링
                filteredTrains = data.realtimeArrivalList.filter(train => train.subwayId === '4');
            } else if (station === '청라국제도시') {
                // 서울행만 필터링 (상행선)
                filteredTrains = data.realtimeArrivalList.filter(train => 
                    train.updnLine === '상행' || train.trainLineNm.includes('서울')
                );
            }
            
            // 필요한 정보만 추출
            const trains = filteredTrains.map(train => ({
                line: train.subwayId + '호선',
                destination: train.trainLineNm,
                arrivalTime: train.barvlDt,
                status: train.arvlMsg2 || train.arvlMsg3,
                direction: train.updnLine
            }));
            
            res.status(200).json({
                success: true,
                station: station,
                trains: trains
            });
        } else {
            res.status(200).json({
                success: false,
                error: '지하철 정보를 찾을 수 없습니다.'
            });
        }
        
    } catch (error) {
        console.error('지하철 API 오류:', error);
        res.status(500).json({
            success: false,
            error: '지하철 정보를 가져올 수 없습니다.'
        });
    }
}
