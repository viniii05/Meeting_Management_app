document.addEventListener('DOMContentLoaded', () => {
    fetch('/slots')
      .then(response => response.json())
      .then(slots => {
        const slotsDiv = document.getElementById('slots');
        slotsDiv.innerHTML = '';
        if (slots.length === 0) {
          slotsDiv.textContent = 'No slots available.';
        } else {
          slots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('slot');
            slotDiv.textContent = `${slot.time} (Available)`;
            slotDiv.dataset.time = slot.time;
            slotDiv.addEventListener('click', () => {
              document.getElementById('selectedTime').value = slot.time;
              document.getElementById('bookingForm').style.display = 'block';
              document.getElementById('confirmation').style.display = 'none';
            });
            slotsDiv.appendChild(slotDiv);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching slots:', error);
        document.getElementById('slots').textContent = 'Error fetching slots.';
      });
  
    fetch('/booked-slots')
      .then(response => response.json())
      .then(bookedSlots => {
        const bookedSlotsDiv = document.getElementById('bookedSlots');
        bookedSlotsDiv.innerHTML = '';
        if (bookedSlots.length === 0) {
          bookedSlotsDiv.textContent = 'No slots have been booked yet.';
        } else {
          bookedSlots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('booked-slot');
            slotDiv.textContent = `Time: ${slot.time}, Booked by User ID: ${slot.userId}`;
            bookedSlotsDiv.appendChild(slotDiv);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching booked slots:', error);
        document.getElementById('bookedSlots').textContent = 'Error fetching booked slots.';
      });
  
    document.getElementById('form').addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      fetch('/book', {
        method: 'POST',
        body: JSON.stringify({
          time: formData.get('time'),
          name: formData.get('name'),
          email: formData.get('email')
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.getElementById('confirmation').textContent = `Hi ${formData.get('name')}, please join the meeting at ${formData.get('time')}`;
          document.getElementById('confirmation').style.display = 'block';
          document.getElementById('bookingForm').style.display = 'none';
          fetch('/booked-slots')
            .then(response => response.json())
            .then(bookedSlots => {
              const bookedSlotsDiv = document.getElementById('bookedSlots');
              bookedSlotsDiv.innerHTML = '';
              if (bookedSlots.length === 0) {
                bookedSlotsDiv.textContent = 'No slots have been booked yet.';
              } else {
                bookedSlots.forEach(slot => {
                  const slotDiv = document.createElement('div');
                  slotDiv.classList.add('booked-slot');
                  slotDiv.textContent = `Time: ${slot.time}, Booked by User ID: ${slot.userId}`;
                  bookedSlotsDiv.appendChild(slotDiv);
                });
              }
            });
        } else {
          document.getElementById('confirmation').textContent = 'Error booking slot.';
          document.getElementById('confirmation').style.display = 'block';
        }
      })
      .catch(error => {
        console.error('Error booking slot:', error);
        document.getElementById('confirmation').textContent = 'Error booking slot.';
        document.getElementById('confirmation').style.display = 'block';
      });
    });
  });
  

  document.addEventListener('DOMContentLoaded', () => {
    fetchSlots();
    fetchBookedSlots();
});

function fetchSlots() {
    fetch('/api/slots')
        .then(response => response.json())
        .then(slots => {
            const slotList = document.getElementById('slot-list');
            slotList.innerHTML = '';
            slots.forEach(slot => {
                const li = document.createElement('li');
                li.textContent = `${slot.time} (available)`;
                slotList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching slots:', error);
            const slotList = document.getElementById('slot-list');
            slotList.innerHTML = 'Error fetching slots.';
        });
}

function fetchBookedSlots() {
    fetch('/api/booked')
        .then(response => response.json())
        .then(bookedSlots => {
            const bookedSlotList = document.getElementById('booked-slot-list');
            bookedSlotList.innerHTML = '';
            
            if (Array.isArray(bookedSlots) && bookedSlots.length > 0) {
                bookedSlots.forEach(booking => {
                    const meetingTime = booking.Meeting ? booking.Meeting.time : 'Unknown time';
                    const li = document.createElement('li');
                    li.textContent = `${meetingTime} (booked by ${booking.name}) `;
                    
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel';
                    cancelButton.onclick = () => cancelBooking(booking.id); 
                    
                    li.appendChild(cancelButton);
                    bookedSlotList.appendChild(li);
                });
            } else {
                bookedSlotList.innerHTML = 'No booked slots available.';
            }
        })
        .catch(error => {
            console.error(error);
            const bookedSlotList = document.getElementById('booked-slot-list');
            bookedSlotList.innerHTML = 'Error fetching booked slots.';
        });
}

function cancelBooking(id) {
    console.log(`Cancel booking with ID: ${id}`);
    fetch(`/api/cancel/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error cancelling booking.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Booking cancelled:', data);
        fetchBookedSlots();
    })
    .catch(error => {
        console.error(error);
    });
}

document.addEventListener('DOMContentLoaded', fetchBookedSlots);
