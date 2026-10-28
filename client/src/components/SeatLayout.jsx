import React from 'react';

const SeatLayout = ({
  layout,
  bookedSeats = [],
  selectedSeats = [],
  ticketPrice = 14.5,
  vipPrice = 22.0,
  onToggleSeat,
  onProceed,
  disabled = false,
}) => {
  const rows = layout?.rows || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = layout?.seatsPerRow || 10;
  const vipRows = layout?.vipRows || ['G', 'H'];

  // Calculate pricing breakdown
  let standardCount = 0;
  let vipCount = 0;
  let totalPrice = 0;

  selectedSeats.forEach((seat) => {
    const rowLetter = seat.charAt(0);
    const isVip = vipRows.includes(rowLetter);
    if (isVip) {
      vipCount++;
      totalPrice += vipPrice;
    } else {
      standardCount++;
      totalPrice += ticketPrice;
    }
  });

  return (
    <div className="seat-layout-wrapper">
      {/* Cinema Screen Graphic */}
      <div className="cinema-screen-container">
        <div className="cinema-screen"></div>
        <div className="cinema-screen-label">
          <i className="bi bi-display me-1"></i> SCREEN THIS WAY
        </div>
      </div>

      {/* Seat Grid */}
      <div className="seat-grid">
        {rows.map((rowLetter) => {
          const isVipRow = vipRows.includes(rowLetter);

          return (
            <div key={rowLetter} className="seat-row">
              {/* Row Label (Left) */}
              <div className="seat-row-label">{rowLetter}</div>

              {/* Seats in this row */}
              <div className="d-flex align-items-center">
                {Array.from({ length: seatsPerRow }, (_, idx) => {
                  const seatNum = idx + 1;
                  const seatId = `${rowLetter}${seatNum}`;
                  const isBooked = bookedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  // Add aisle gap in the middle
                  const isAisleGap = seatNum === Math.floor(seatsPerRow / 2);

                  let seatClass = 'seat-available';
                  if (isBooked) {
                    seatClass = 'seat-booked';
                  } else if (isSelected) {
                    seatClass = 'seat-selected';
                  }

                  return (
                    <button
                      key={seatId}
                      type="button"
                      disabled={isBooked || disabled}
                      onClick={() => onToggleSeat(seatId)}
                      className={`seat-box ${seatClass} ${isAisleGap ? 'seat-aisle-gap' : ''}`}
                      title={`${seatId} - ${isVipRow ? 'VIP' : 'Standard'} ($${isVipRow ? vipPrice.toFixed(2) : ticketPrice.toFixed(2)})${isBooked ? ' [Booked]' : ''}`}
                    >
                      {seatNum}
                    </button>
                  );
                })}
              </div>

              {/* Row Label (Right) */}
              <div className="seat-row-label">{rowLetter}</div>
            </div>
          );
        })}
      </div>

      {/* Seat Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-swatch seat-box seat-available" style={{ width: '18px', height: '18px', cursor: 'default' }}></div>
          <span>Available (${ticketPrice.toFixed(2)})</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch seat-box seat-selected" style={{ width: '18px', height: '18px', cursor: 'default' }}></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch seat-box seat-booked" style={{ width: '18px', height: '18px', cursor: 'default' }}></div>
          <span>Occupied</span>
        </div>
        <div className="legend-item">
          <span className="badge bg-purple text-light" style={{ backgroundColor: '#8b5cf6' }}>
            Rows {vipRows.join(', ')}: VIP (${vipPrice.toFixed(2)})
          </span>
        </div>
      </div>

      {/* Selected Seats summary bar */}
      <div className="p-3 mt-4 rounded-3 bg-dark border border-secondary border-opacity-25 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div>
          <div className="small text-secondary mb-1">Your Selection</div>
          {selectedSeats.length > 0 ? (
            <div className="d-flex flex-wrap gap-1 align-items-center">
              {selectedSeats.map((seat) => (
                <span key={seat} className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-2 py-1">
                  {seat}
                </span>
              ))}
              <span className="text-secondary small ms-2">
                ({selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'})
              </span>
            </div>
          ) : (
            <div className="text-muted small italic">Click on available seats above to select your spots.</div>
          )}
        </div>

        <div className="d-flex align-items-center gap-4">
          <div className="text-end">
            <div className="small text-secondary">Total Amount</div>
            <div className="fs-4 fw-bold text-white">
              ${totalPrice.toFixed(2)}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-cinema-primary btn-lg"
            disabled={selectedSeats.length === 0 || disabled}
            onClick={onProceed}
          >
            <i className="bi bi-arrow-right-circle me-1"></i>
            <span>Continue to Booking</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
