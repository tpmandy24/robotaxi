from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.robotaxi import CleaningStatus, OperationalStatus
from app.schemas.robotaxi_schema import RobotaxiCreate, RobotaxiResponse, RobotaxiUpdate
from app.services.robotaxi_service import RobotaxiService

router = APIRouter(prefix="/api/robotaxis", tags=["robotaxis"])


@router.get(
    "/",
    response_model=List[RobotaxiResponse],
    summary="List all Robotaxis in the local fleet",
    description=(
        "Returns all Robotaxis in the local fleet, with optional pagination and filtering. "
        "Combine the query parameters below to narrow the result set, e.g. "
        "`operational_status=Charging&cleaning_status=Needs Cleaning`."
    ),
)
def list_robotaxis(
    skip: int = Query(default=0, ge=0, description="Number of records to skip, for pagination."),
    limit: int = Query(default=100, ge=1, le=500, description="Maximum number of records to return."),
    operational_status: Optional[OperationalStatus] = Query(
        default=None, description="Filter by exact operational status."
    ),
    cleaning_status: Optional[CleaningStatus] = Query(
        default=None, description="Filter by exact cleaning status."
    ),
    model: Optional[str] = Query(
        default=None, description="Filter by vehicle model (case-insensitive, partial match)."
    ),
    location: Optional[str] = Query(
        default=None, description="Filter by current location (case-insensitive, partial match)."
    ),
    db: Session = Depends(get_db),
):
    return RobotaxiService(db).list_robotaxis(
        skip=skip,
        limit=limit,
        operational_status=operational_status,
        cleaning_status=cleaning_status,
        model=model,
        location=location,
    )


@router.get(
    "/{robotaxi_id}",
    response_model=RobotaxiResponse,
    summary="Get details of a specific Robotaxi",
    description="Returns the full record for a single Robotaxi by its unique identifier.",
    responses={404: {"description": "No Robotaxi exists with the given id."}},
)
def get_robotaxi(robotaxi_id: int, db: Session = Depends(get_db)):
    return RobotaxiService(db).get_robotaxi(robotaxi_id)


@router.post(
    "/",
    response_model=RobotaxiResponse,
    status_code=201,
    summary="Register a new Robotaxi to the local fleet",
    description="Adds a new Robotaxi to the local fleet. The VIN must be unique across the fleet.",
    responses={400: {"description": "A Robotaxi with this VIN is already registered."}},
)
def create_robotaxi(robotaxi_in: RobotaxiCreate, db: Session = Depends(get_db)):
    return RobotaxiService(db).create_robotaxi(robotaxi_in)


@router.put(
    "/{robotaxi_id}",
    response_model=RobotaxiResponse,
    summary="Update Robotaxi status",
    description=(
        "Updates one or more fields on an existing Robotaxi, e.g. mark it as cleaned "
        "(`cleaning_status`) or send it to charging (`operational_status`). "
        "Only the fields included in the request body are changed."
    ),
    responses={404: {"description": "No Robotaxi exists with the given id."}},
)
def update_robotaxi(robotaxi_id: int, robotaxi_in: RobotaxiUpdate, db: Session = Depends(get_db)):
    return RobotaxiService(db).update_robotaxi(robotaxi_id, robotaxi_in)


@router.delete(
    "/{robotaxi_id}",
    status_code=204,
    summary="Remove a Robotaxi from the local fleet",
    description="Permanently deletes a Robotaxi, along with its incident reports and ride logs.",
    responses={404: {"description": "No Robotaxi exists with the given id."}},
)
def delete_robotaxi(robotaxi_id: int, db: Session = Depends(get_db)):
    RobotaxiService(db).delete_robotaxi(robotaxi_id)
