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
        
        console.log('API 응답:', JSON.stringify(data, null, 2)); // 디버깅용
        
        if (data.realtimeArrivalList && data.realtimeArrivalList.length > 0) {
            let filteredTrains = data.realtimeArrivalList;
            
            // 역별 필터링
            if (station === '동대문역사문화공원') {
                // 4호선 하행선(오이도행, 사당행)만 필터링
                filteredTrains = data.realtimeArrivalList.filter(train => 
                    train.subwayId === '4' && 
                    train.updnLine === '하행' && 
                    (train.trainLineNm.includes('오이도') || train.trainLineNm.includes('사당'))
                );
            } else if (station === '청라국제도시') {
                // 공항철도 서울행만 필터링 (인천공항행 제외)
                filteredTrains = data.realtimeArrivalList.filter(train => 
                    train.trainLineNm.includes('서울') && !train.trainLineNm.includes('인천공항')
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
            console.log('API 응답 구조:', data); // 디버깅용
            res.status(200).json({
                success: false,
                error: '지하철 정보를 찾을 수 없습니다.',
                debug: data
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
