from fastapi import APIRouter, Query
from typing import Optional
from app.services.idw_heatmap import calculate_idw_grid

router = APIRouter(prefix="/heatmap", tags=["Heatmap"])

@router.get("")
def get_heatmap_grid(
    parameter: Optional[str] = Query(None, description="pm2_5, pm10, co2, temperature, humidity, wind_speed"),
    layer: Optional[str] = Query(None, description="Alias for parameter"),
    upto: Optional[int] = Query(None, ge=1, le=50, description="Calculate IDW cumulative field up to observation index"),
    grid_size: int = Query(24, ge=8, le=48, description="Resolution of spatial interpolation matrix")
):
    """
    Returns real IDW spatial interpolation matrix calculated directly over the Kharghar CSV observations.
    """
    param = parameter or layer or "pm25"
    return calculate_idw_grid(layer=param, upto=upto, grid_size=grid_size)
