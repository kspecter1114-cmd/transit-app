export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { stationId } = req.query;
    
    try {
        const apiKey = '766d516b636b73703837474e547a4f';
        
        const response = await fetch(
            `http://apis.data.go.kr/6280000/busArrivalService/getBusArrivalList?serviceKey=${apiKey}&stationId=${stationId}&numOfRows=10&pageNo=1&type=json`
        );
        
        const data = await response.json();
        
        if (data.response?.body?.items) {
            res.status(200).json({
                success: true,
                data: data.response.body.items
            });
        } else {
            res.status(200).json({
                success: false,
                error: '버스 정보를 찾을 수 없습니다.'
            });
        }
        
    } catch (error) {
        console.error('버스 API 오류:', error);
        res.status(500).json({
            success: false,
            error: '버스 정보를 가져올 수 없습니다.'
        });
    }
}
