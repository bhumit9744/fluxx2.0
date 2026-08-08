import asyncio
import json
import logging
from typing import List
from fastapi import WebSocket

logger = logging.getLogger("fluxx.ws")

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket client connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast_json(self, data: dict):
        if not self.active_connections:
            return
        
        payload = json.dumps(data)
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception:
                disconnected.append(connection)
                
        for dead in disconnected:
            if dead in self.active_connections:
                self.active_connections.remove(dead)

ws_manager = WebSocketManager()
